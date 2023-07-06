const bcrypt = require("bcryptjs");
const jsonWebToken = require("jsonwebtoken");
const User = require("../models/user");

const ErrorBadRequest = require("../errors/errorBadRequest");
const ErrorNotFound = require("../errors/errorNotFound");
const ErrorConflict = require("../errors/errorConflict");
const ErrorServer = require("../errors/errorServerNoRespond");
const ErrorUnauthorized = require("../errors/errorUnauthorized");

const loginUser = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select("+password")
    .then((user) => {
      bcrypt
        .compare(password, user.password)
        .then((isValidaUser) => {
          if (isValidaUser) {
            const jwt = jsonWebToken.sign({ _id: user._id }, "SECRET");
            res.cookie("jwt", jwt, {
              maxage: 360000,
              httpOnly: true,
            });
            res.send(user);
          } else {
            throw new ErrorUnauthorized("Переданы некорректные данные.");
          }
        })
        .catch(next);
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, about, avatar, email, password: hash }))
    .then((user) => res.send(user.toJSON()))
    .catch((err) => {
      if (err.name === "ValidationError") {
        throw new ErrorBadRequest(`Переданы некорректные данные.`);
      } else if (err.code === 11000) {
        throw new ErrorConflict(`Такой e-mail уже занят.`);
      }
      next(err);
    });
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const getCurrentUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new ErrorNotFound("Пользователь не найден!"))
    .then((user) => res.send(user))
    .catch((err) => next(err));
};

const updateUserInfo = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        throw new ErrorBadRequest(`Переданы некорректные данные.`);
      } else {
        throw new ErrorServer(`Произошла ошибка сервера.`);
      }
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        throw new ErrorBadRequest(`Переданы некорректные данные.`);
      } else {
        throw new ErrorServer(`Произошла ошибка сервера.`);
      }
    });
};

const getUserId = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new ErrorNotFound(`Пользователь не был найден.`);
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        throw new ErrorBadRequest(`Некорректные данные.`);
      }
      next(err);
    })
    .catch(next);
};

module.exports = {
  createUser,
  getUsers,
  updateUserInfo,
  updateUserAvatar,
  getUserId,
  loginUser,
  getCurrentUserInfo,
};
