const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const limiter = require('./utils/limiter');
const index = require('./routes/index');
const NotFoundError = require('./errors/NotFoundError');
const corsOptions = require('./utils/corsOptions');
const errorHandler = require('./middlewares/errorHandler');
const {
  requestLogger,
  errorLogger,
} = require('./middlewares/logger');

// bitfilmsdb - по заданию, по коммент. moviesdb
const { PORT = 3100, PTH = 'mongodb://localhost:27017/moviesdb' } = process.env;

const app = express();

app.use('*', cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(PTH, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
});
app.use(requestLogger);

app.use(limiter);
app.use(helmet());

app.use('/', index);
app.use('*', () => {
  throw new NotFoundError('страница не найдена');
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
