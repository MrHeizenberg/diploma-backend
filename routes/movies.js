const router = require('express').Router();
const { savedMovies, addMovie, deleteMovie } = require('../controllers/movies');
const { validateMovieBody, validateDeleteParams } = require('../middlewares/validations');

router.get('/', savedMovies);
router.post('/', validateMovieBody, addMovie);
router.delete('/:movieId', validateDeleteParams, deleteMovie);

module.exports = router;
