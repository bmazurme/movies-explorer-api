const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const bodyParser = require('body-parser');
const users = require('./routes/users');
const movies = require('./routes/movies');
const auth = require('./middlewares/auth');
const {
  validateLoginData,
  validateRegistrData,
} = require('./utils/validator');

const {
  createUser,
  login,
} = require('./controllers/users');
const NotFoundError = require('./errors/NotFoundError');
const {
  requestLogger,
  errorLogger,
} = require('./middlewares/logger');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
});
app.use(requestLogger);

app.post(
  '/signin',
  validateLoginData,
  login,
);
app.post(
  '/signup',
  validateRegistrData,
  createUser,
);

app.use('/', auth, users);
app.use('/', auth, movies);

app.use('*', auth, () => {
  throw new NotFoundError('страница не найдена');
});
app.use(errorLogger);
app.use(errors());
app.use(
  (err, req, res, next) => {
    const {
      statusCode = err.status,
      message = err.message,
    } = err;

    res.status(statusCode).send({ message });
    next();
  },
);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
