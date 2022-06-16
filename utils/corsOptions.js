const {
  METHODS,
  ALLOWED_HEADERS,
  WHITE_LIST,
} = require('express-rate-limit');

const checkWhiteList = (origin, callback) => {
  if (WHITE_LIST.indexOf(origin) !== -1 || !origin) {
    callback(null, true);
  } else {
    callback(new Error('Not allowed by CORS'));
  }
};

const corsOptions = {
  credentials: true,
  origin: checkWhiteList,
  methods: METHODS,
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ALLOWED_HEADERS,
};

module.exports = { corsOptions };
