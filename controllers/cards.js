const Card = require("../models/card");
const {
  ERROR_BAD_REQUEST,
  ERROR_NOT_FOUND,
  SERVER_ERROR,
} = require("../errors/error");

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => {
      res.status(SERVER_ERROR).send({
        message: "Сервер столкнулся с неожиданной ошибкой.",
        err: err.message,
      });
    });
};

const postCard = (req, res) => {
  const { name, link } = req.body;
  const { _id } = req.user;

  Card.create({ name, link, owner: _id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res
          .status(ERROR_BAD_REQUEST)
          .send({ message: "Переданы некорректные данные карточки." });
        return;
      } else {
        res.status(SERVER_ERROR).send({
          message: "Сервер столкнулся с неожиданной ошибкой.",
          err: err.message,
        });
      }
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndDelete(req.params.cardId)
    .orFail(() => new Error("Not Found"))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === "Not Found") {
        res.status(ERROR_NOT_FOUND).send({ message: "Карта не была найдена!" });
        return;
      } else if (err.name === "CastError") {
        res
          .status(ERROR_BAD_REQUEST)
          .send({ message: "Переданы некорректные данные карточки." });
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

const likeCard = (req, res) => {
  const { _id } = req.user;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(() => new Error("Not Found"))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === "Not Found") {
        res.status(ERROR_NOT_FOUND).send({ message: "Карта не была найдена!" });
        return;
      } else if (err.name === "CastError") {
        res
          .status(ERROR_BAD_REQUEST)
          .send({ message: "Переданы некорректные данные карточки." });
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

const deleteLike = (req, res) => {
  const { _id } = req.user;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(() => new Error("Not Found"))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === "Not Found") {
        res.status(ERROR_NOT_FOUND).send({ message: "Карта не была найдена!" });
        return;
      } else if (err.name === "CastError") {
        res
          .status(ERROR_BAD_REQUEST)
          .send({ message: "Переданы некорректные данные карточки." });
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

module.exports = { getCards, postCard, deleteCard, likeCard, deleteLike };
