const { SERVER_ERROR } = require("../errors/error");

const errorHandler = (req, res, next, err) => {
  const { statusCode = SERVER_ERROR, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500 ? "На сервере произошла ошибка" : message,
    });

  next();
};

module.exports = errorHandler;
