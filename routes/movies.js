const moviesRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

const urlValidator = (value, helpers) => {
  if (validator.isURL(value)) {console.log('not url'); return value}
  return helpers.message(`${value} is not url`);
};

moviesRouter.get('/', getMovies);
moviesRouter.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string().required().custom(urlValidator),
      trailer: Joi.string().required().custom(urlValidator),
      thumbnail: Joi.string().required().custom(urlValidator),
      movieId: Joi.number().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
    }),
  }),
  createMovie
);
moviesRouter.delete(
  '/:movieId',
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().alphanum().length(24),
    }),
  }),
  deleteMovie
);

module.exports = moviesRouter;
