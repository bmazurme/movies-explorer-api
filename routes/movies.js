const router = require('express').Router();
const {
  validateMovieData,
  // validateObjectId,
} = require('../utils/validator');

const {
  createMovie,
  getMovies,
  deleteMovie,
} = require('../controllers/movies');

router.post(
  '/movies',
  validateMovieData,
  createMovie,
);

router.get('/movies', getMovies);

router.delete(
  '/movies/:id',
  // validateObjectId,
  deleteMovie,
);

module.exports = router;
