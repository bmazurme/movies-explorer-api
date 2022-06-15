module.exports = (err, req, res, next) => {
  const {
    statusCode = err.status,
    message = err.message,
  } = err;

  res.status(statusCode).send({ message });
  next();
};
