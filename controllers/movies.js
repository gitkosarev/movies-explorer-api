const statusCode = require('http2').constants;

const Movie = require('../models/movie');
const { handleError } = require('../middlewares/errorHandler');
const ForbiddenError = require('../errors/ForbiddenError');

// METHOD: GET
module.exports.getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((result) => {
      res.send(result);
    })
    .catch((err) => handleError(err, next));
};

// METHOD: POST
module.exports.createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description, image,
    trailerLink, thumbnail, movieId, nameRU, nameEN,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner,
    movieId,
    nameRU,
    nameEN,
  })
    .then((result) => {
      res.status(statusCode.HTTP_STATUS_CREATED).send(result);
    })
    .catch((err) => handleError(err, next));
};

// METHOD: DELETE
module.exports.deleteMovie = (req, res, next) => {
  const currentUserId = req.user._id;
  const { id } = req.params;
  Movie.findById(id)
    .orFail()
    .then((result) => {
      if (String(result.owner) !== currentUserId) {
        return Promise.reject(new ForbiddenError('Удалять чужие фильмы запрещено.'));
      }
      return Movie.findByIdAndRemove(id)
        .orFail()
        .then((removedResult) => res.send(removedResult))
        .catch((err) => handleError(err, next));
    })
    .catch((err) => handleError(err, next));
};
