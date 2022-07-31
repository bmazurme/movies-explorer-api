const Movie = require('../models/movie');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const {
  FILM_NOT_FOUND_RU,
  BAD_REQUEST_RU,
  FORBIDDEN_RU,
} = require('../utils/constErrors');

module.exports.createMovie = (req, res, next) => {
  const mov = req.body;

  Movie.create({ ...mov, owner: req.user._id })
    .then((movie) => res.status(200).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(BAD_REQUEST_RU));
      }
      return next(err);
    });
};

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movie) => res.send(movie))
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.id)
    .orFail(() => new NotFoundError(FILM_NOT_FOUND_RU))
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        return next(new ForbiddenError(FORBIDDEN_RU));
      }
      return movie.remove()
        .then(() => res.send({ message: 'фильм удален' }));
    })
    .catch(next);
};
