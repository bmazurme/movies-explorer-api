const { celebrate, Joi } = require('celebrate');
const { isValidObjectId } = require('mongoose');
const validator = require('validator');
const BadRequestError = require('../errors/BadRequestError');

const checkUrl = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.message('поле заполнено некорректно');
};

const StringRequired = Joi.string().required();

const validateObjectId = celebrate({
  params: Joi.object().keys({
    id: StringRequired.custom((value) => {
      if (!isValidObjectId(value)) {
        throw new BadRequestError('переданы некорректные данные');
      }
      return value;
    }),
  }),
});

const validateMovieData = celebrate({
  body: Joi.object().keys({
    nameRU: Joi.string().min(2).max(30).required(),
    nameEN: Joi.string().min(2).max(30).required(),
    country: Joi.string().min(2).max(30).required(),
    director: Joi.string().min(2).max(30).required(),
    description: Joi.string().min(2).max(200).required(),
    duration: Joi.number().required(),
    year: Joi.string().min(2).max(4).required(),
    image: Joi.string().required().custom(checkUrl),
    trailerLink: Joi.string().required().custom(checkUrl),
    thumbnail: Joi.string().required().custom(checkUrl),
    movieId: Joi.number().required(),
  }),
});

const validateUserData = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

const validateLoginData = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateRegistrData = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(checkUrl),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

module.exports = {
  validateObjectId,
  validateUserData,
  validateMovieData,
  validateLoginData,
  validateRegistrData,
};
