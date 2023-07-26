const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { urlRegex } = require('../utils/regex');
const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');

// region: GET
router.get('/', getMovies);

// region: POST
router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(urlRegex),
    trailerLink: Joi.string().required().pattern(urlRegex),
    thumbnail: Joi.string().required().pattern(urlRegex),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);

// region: DELETE
router.delete('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required(),
  }),
}), deleteMovie);

module.exports = router;
