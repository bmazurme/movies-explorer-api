const mongoose = require('mongoose');
const isUrl = require('validator/lib/isURL');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  director: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 4,
  },
  description: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 200,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (link) => isUrl(link),
      message: 'некорректные данные',
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: (link) => isUrl(link),
      message: 'некорректные данные',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (link) => isUrl(link),
      message: 'некорректные данные',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  nameEN: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

module.exports = mongoose.model('movie', movieSchema);
