const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ConflictError = require('../errors/ConflictError');

const DEV_JWT_SECRET = require('../utils/devConfig');
const {
  USER_NOT_FOUND_RU,
  USER_BAD_REQUEST_RU,
  USER_CONFLICT_RU,
} = require('../utils/constErrors');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, process.env.NODE_ENV === 'production'
        ? process.env.JWT_SECRET
        : DEV_JWT_SECRET.DEV_JWT_SECRET, { expiresIn: '7d' });
      res
        // .cookie('jwt', token, {
        //   maxAge: 3600000 * 24 * 7,
        //   httpOnly: true,
        //   sameSite: true,
        // })
        // .send({ message: 'Успешная авторизация' });
        .send({ token });
    })
    .catch(() => next(new UnauthorizedError(USER_BAD_REQUEST_RU)));
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => res.send({
      _id: user._id,
      name,
      email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError());
      }
      if (err.code === 11000) {
        return next(new ConflictError(USER_CONFLICT_RU));
      }
      return next(err);
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError(USER_NOT_FOUND_RU));
      }
      return res.send(user);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    {
      name,
      email,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((data) => {
      if (!data) {
        return next(new NotFoundError(USER_NOT_FOUND_RU));
      }
      return res.send(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError());
      }
      if (err.code === 11000) {
        return next(new ConflictError(USER_CONFLICT_RU));
      }
      return next(err);
    });
};
