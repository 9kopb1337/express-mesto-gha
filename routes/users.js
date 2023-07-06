const router = require("express").Router();

const {
  getUsers,
  getUserInfo,
  updateUserInfo,
  updateUserAvatar,
  getUserId,
} = require("../controllers/users");

const {
  validateUserId,
  validateUserInfoUpdate,
  validateUserAvatarUpdate,
} = require("../middlewares/validate");

router.get("/", getUsers);
router.get("/me", getUserInfo);
router.get("/:userId", validateUserId, getUserId);
router.patch("/me", validateUserInfoUpdate, updateUserInfo);
router.patch("/me/avatar", validateUserAvatarUpdate, updateUserAvatar);

module.exports = router;
