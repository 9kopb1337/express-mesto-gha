const Card = require("../models/card");
const {
  ERROR_BAD_REQUEST,
  ERROR_NOT_FOUND,
  SERVER_ERROR,
} = require("../errors/error");

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => {
      res
        .status(SERVER_ERROR)
        .send({ message: `Сервер столкнулся с неожиданной ошибкой.` });
    });
};

module.exports.postCard = (req, res) => {
  const { name, link } = req.body;
  const { _id } = req.user;

  Card.create({ name, link, owner: _id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (!name || !link) {
        res.status(ERROR_BAD_REQUEST).send({
          message: `Переданы некорректные данные при создании карточки.`,
        });
        return;
      } else {
        res
          .status(SERVER_ERROR)
          .send({ message: `Сервер столкнулся с неожиданной ошибкой.` });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndDelete(cardId)
    .then((card) => {
      if (!card) {
        res.status(ERROR_NOT_FOUND).send({
          message: `Карточка не найдена.`,
        });
        return;
      }
      res.send({ message: `Карточка удалена.` });
    })
    .catch((err) => {
      if (!Card[cardId]) {
        res
          .status(ERROR_BAD_REQUEST)
          .send({ message: `Переданы некорректные данные карточки.` });
      }
    });
};

module.exports.likeCard = (req, res) => {
  const { _id } = req.user;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: _id}}, { new: true }).then(card => {
    if(!card) {
      res.status(ERROR_NOT_FOUND).send({
        message: `Карточка не найдена.`,
      });
      return;
    }
    res.send(card);
  }).catch(err => {
    if(!Card[cardId]) {
      res.status(ERROR_BAD_REQUEST).send({ message: `Переданы некорректные данные карточки.` });
      return;
    } else {
      res.status(SERVER_ERROR).send({ message: `Сервер столкнулся с неожиданной ошибкой.` });
    }
  });
};

module.exports.deleteLike = (req, res) => {
  const { _id } = req.user;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(cardId, { $pull: { likes: _id}}, { new: true }).then(card => {
    if(!card) {
      res.status(ERROR_NOT_FOUND).send({
        message: `Карточка не найдена.`,
      });
      return;
    }
    res.send(card);
  }).catch(err => {
    if(!Card[cardId]) {
      res.status(ERROR_BAD_REQUEST).send({ message: `Переданы некорректные данные карточки.` });
      return;
    } else {
      res.status(SERVER_ERROR).send({ message: `Сервер столкнулся с неожиданной ошибкой.` });
    }
  });
};
