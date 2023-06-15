const router = require('express').Router();

const { createUser, getUsers, updateUserInfo, updateUserAvatar, getUserId } = require('../controllers/users');

router.post('/', createUser);
router.get('/', getUsers);
router.get('/:userId', getUserId);
router.patch('/me', updateUserInfo);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;