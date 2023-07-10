const router = require('express').Router();
const userRoutes = require('./users');
const cardsRoutes = require('./cards');
const { loginUser, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const ErrorNotFound = require('../errors/errorNotFound');
const { validateUserSingUp, validateUserSignIn } = require('../middlewares/validate');

router.post('/signup', validateUserSingUp, createUser);
router.post('/signin', validateUserSignIn, loginUser);

router.use(auth);

router.use('/users', userRoutes);
router.use('/cards', cardsRoutes);

router.use('*', (req, res, next) => {
  next(new ErrorNotFound('Маршрут не найден!'));
});

module.exports = router;
