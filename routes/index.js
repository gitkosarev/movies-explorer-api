const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const { login, createUser } = require('../controllers/users');
const userRouter = require('./users');
const movieRouter = require('./movies');
const NotFoundError = require('../errors/NotFoundError');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
  }),
}), createUser);

router.use(auth);

router.use('/users', userRouter);
router.use('/movies', movieRouter);

router.use((req, res, next) => {
  next(new NotFoundError(`Маршрут ${req.path} не найден.`));
});

module.exports = router;
