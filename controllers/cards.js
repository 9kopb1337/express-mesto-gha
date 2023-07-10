const Card = require("../models/card");

const ErrorBadRequest = require("../errors/errorBadRequest");
const ErrorForbidden = require("../errors/errorForbidden");
const ErrorNotFound = require("../errors/errorNotFound");

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

const postCard = (req, res, next) => {
  const { name, link } = req.body;
  const { _id } = req.user;

  Card.create({ name, link, owner: _id })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(
          new ErrorBadRequest(
            `Переданные данные карточки при создании некорректны: ${err}`
          )
        );
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => new ErrorNotFound(`Карточка не найдена`))
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        card
          .deleteOne(card)
          .then((cards) => res.send(cards))
          .catch(next);
      } else {
        throw new ErrorForbidden(`Нельзя удалить чужую карточку`);
      }
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user.id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        throw new ErrorNotFound(`Карточка не найдена!`);
      } else {
        next(res.status(200).send(card));
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(
          new ErrorBadRequest(`Переданы некорректные данные карточки: ${err}`)
        );
      } else {
        next(err);
      }
    });
};

const deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user.id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        throw new ErrorNotFound(`Карточка не найдена!`);
      } else {
        next(res.status(200).send(card));
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(
          new ErrorBadRequest(`Переданы некорректные данные карточки: ${err}`)
        );
      } else {
        next(err);
      }
    });
};

module.exports = { getCards, postCard, deleteCard, likeCard, deleteLike };
