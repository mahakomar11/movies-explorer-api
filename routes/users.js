const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getProfile, updateProfile } = require('../controllers/users');

usersRouter.get('/me', getProfile);
usersRouter.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().email().required(),
    }),
  }),
  updateProfile
);
module.exports = usersRouter;
