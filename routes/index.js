const router = require('express').Router();
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const auth = require('../middlewares/auth');
const { createUser, login } = require('../controllers/users');
const NotFoundError = require('../errors/not-found-err');
const { validateUserBody, validateAuthBody } = require('../middlewares/validations');

router.post('/signup', validateUserBody, createUser);
router.post('/signin', validateAuthBody, login);
router.use(auth);
router.use('/users', usersRouter);
router.use('/movies', moviesRouter);
router.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
