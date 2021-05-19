const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const CustomError = require('../utils/errors');

const getProfile = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send(user))
    .catch(next);
};

const updateProfile = (req, res, next) => {
  const { email, name } = req.body;

  if (!email || !name)
    throw new CustomError(400, 'Поля email и name обязательные');

  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    { new: true, runValidators: true }
  )
    .then((updatedUser) => res.send(updatedUser))
    .catch(next);
};

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!email || !password)
    throw new CustomError(400, 'Поля email и password обязательные');

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, email, password: hash }))
    .then((user) => {
      res.send({ _id: user._id, name, email });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    throw new CustomError(400, 'Поля email и password обязательные');

  const { NODE_ENV, JWT_SECRET } = process.env;

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) throw new CustomError(401, 'Неправильные почта или пароль');

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched)
          throw new CustomError(401, 'Неправильные почта или пароль');

        const token = jwt.sign(
          { _id: user._id },
          NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
          {
            expiresIn: '7d',
          }
        );

        return res.send({ token });
      });
    })
    .catch(next);
};

module.exports = {
  getProfile,
  updateProfile,
  createUser,
  login,
};
