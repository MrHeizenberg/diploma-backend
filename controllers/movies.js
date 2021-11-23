const Movie = require('../models/movie');
const CastError = require('../errors/cast-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

const savedMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => {
      if (movies) {
        res.status(200).send(movies);
      }
    })
    .catch((err) => {
      next(err);
    });
};

const addMovie = (req, res, next) => {
  const {
    country, director, duration, year, description, image, trailer, thumbnail, movieId, nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => {
      res.status(200).send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new CastError('Переданы некорректные данные при создании пользователя'));
      }
      return next(err);
    });
};

const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  Movie.findById(movieId)
    .then((movie) => {
      if (movie) {
        return Movie.findOneAndDelete({ owner: req.user, _id: movieId })
          .then((movieOwner) => {
            if (movieOwner) {
              return res.status(200).send({ message: 'Удалено' });
            }
            return next(new ForbiddenError('Вы не можете удалять чужие фильмы'));
          });
      }
      return next(new NotFoundError('Нет фильма по заданному id'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new CastError('Задан некорректный id'));
      }
      return next(err);
    });
};

module.exports = { savedMovies, addMovie, deleteMovie };
