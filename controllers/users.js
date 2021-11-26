const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ConflictError = require('../errors/conflict-err');
const CastError = require('../errors/cast-err');
const AuthError = require('../errors/auth-err');

const { JWT_SECRET, NODE_ENV } = process.env;

const getAuthUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.send(user);
      }
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        return next(new ConflictError('Пользователь с таким email уже существует'));
      }
      return User.findByIdAndUpdate(
        req.user._id,
        { name, email },
        { new: true, runValidators: true },
      )
        .then((newuser) => {
          if (newuser) {
            res.send(newuser);
          }
        });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new CastError('Переданы некорректные данные при создании пользователя'));
      }
      return next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    })
      .then(() => {
        res.send({ message: 'Пользователь создан' });
      }))
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError('Пользователь с таким email уже существует'));
      }
      if (err.name === 'ValidationError') {
        return next(new CastError('Переданы некорректные данные при создании пользователя'));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return next(new AuthError('Неправильное имя пользователя или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return next(new AuthError('Неправильное имя пользователя или пароль'));
          }
          const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
          return res.send({ token });
        });
    })
    .catch(next);
};

module.exports = {
  getAuthUser, updateUser, createUser, login,
};
