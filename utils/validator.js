const { celebrate, Joi } = require('celebrate');
const { isValidObjectId } = require('mongoose');
const BadRequestError = require('../errors/BadRequestError');

const EMAIL_URL = /^((http|https):\/\/)?(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)/i;

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
    image: Joi.string().pattern(EMAIL_URL).required(),
    trailerLink: Joi.string().pattern(EMAIL_URL).required(),
    thumbnail: Joi.string().pattern(EMAIL_URL).required(),
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
    avatar: Joi.string().pattern(EMAIL_URL),
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
