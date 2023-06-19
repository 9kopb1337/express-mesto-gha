const User = require("../models/user");
const {
  ERROR_BAD_REQUEST,
  ERROR_NOT_FOUND,
  SERVER_ERROR,
} = require("../errors/error");

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(ERROR_BAD_REQUEST).send({
          message: "Переданы некорректные данные при создании пользователя.",
        });
        return;
      } else {
        res
          .status(SERVER_ERROR)
          .send({
            message: "Сервер столкнулся с неожиданной ошибкой.",
            err: err.message,
          });
      }
    });
};

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      return res
        .status(SERVER_ERROR)
        .send({
          message: "Сервер столкнулся с неожиданной ошибкой.",
          err: err.message,
        });
    });
};

const updateUserInfo = (req, res) => {
  const { _id } = req.user;
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    _id,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res
          .status(ERROR_BAD_REQUEST)
          .send({ message: "Переданы некорректные данные пользователя." });
        return;
      } else {
        res
          .status(SERVER_ERROR)
          .send({
            message: "Сервер столкнулся с неожиданной ошибкой.",
            err: err.message,
          });
      }
    });
};

const updateUserAvatar = (req, res) => {
  const { _id } = req.user;
  const { avatar } = req.body;

  User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res
          .status(ERROR_BAD_REQUEST)
          .send({ message: "Переданы некорректные данные пользователя." });
        return;
      } else {
        res
          .status(SERVER_ERROR)
          .send({
            message: "Сервер столкнулся с неожиданной ошибкой.",
            err: err.message,
          });
      }
    });
};

const getUserId = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(ERROR_BAD_REQUEST).send({
          message: "Переданы некорректные данные пользователя.",
        });
        return;
      } else {
        res
          .status(SERVER_ERROR)
          .send({
            message: "Сервер столкнулся с неожиданной ошибкой.",
            err: err.message,
          });
      }
    });
};

module.exports = {
  createUser,
  getUsers,
  updateUserInfo,
  updateUserAvatar,
  getUserId,
};
