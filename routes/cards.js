const router = require("express").Router();

const {
  getCards,
  postCard,
  deleteCard,
  likeCard,
  deleteLike,
} = require("../controllers/cards");

const { validateCardPost, validateCardId } = require('../middlewares/validate');

router.get("/", getCards);
router.post("/", validateCardPost, postCard);
router.delete("/:cardId", validateCardId, deleteCard);
router.put("/:cardId/likes", validateCardId, likeCard);
router.delete("/:cardId/likes", validateCardId, deleteLike);

module.exports = router;
