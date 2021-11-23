const router = require('express').Router();
const { savedMovies, addMovie, deleteMovie } = require('../controllers/movies');

router.get('/', savedMovies);
router.post('/', addMovie);
router.delete('/:movieId', deleteMovie);

module.exports = router;
