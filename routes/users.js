const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers, getCurrentUser, getUserById, updateUser,
} = require('../controllers/users');

// region: GET
router.get('/', getUsers);

router.get('/me', getCurrentUser);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24).required(),
  }),
}), getUserById);

// region: PATCH
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email(),
  }),
}), updateUser);

module.exports = router;
