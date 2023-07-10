const router = require("express").Router();

const {
  validateUserId,
  validateUserInfoUpdate,
  validateUserAvatarUpdate,
} = require("../middlewares/validate");

const {
  getUsers,
  getCurrentUserInfo,
  updateUserInfo,
  updateUserAvatar,
  getUserId,
} = require("../controllers/users");

router.get("/", getUsers);
router.get("/me", getCurrentUserInfo);
router.get("/:userId", validateUserId, getUserId);
router.patch("/me", validateUserInfoUpdate, updateUserInfo);
router.patch("/me/avatar", validateUserAvatarUpdate, updateUserAvatar);

module.exports = router;
