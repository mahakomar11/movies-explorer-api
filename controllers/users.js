const User = require('../models/user');
const CustomError = require('../utils/errors');

const getProfile = (req, res, next) => {
  User.findById(req.userId)
    .then((user) => res.send(user))
    .catch(next);
};

const updateProfile = (req, res, next) => {
  const { email, name } = req.body;

  if (!email || !name)
    throw new CustomError(400, 'Поля email и name обязательные');

  User.findByIdAndUpdate(
    req.userId,
    { email, name },
    { new: true, runValidators: true }
  )
    .then((updatedUser) => res.send(updatedUser))
    .catch(next);
};

module.exports = {
  getProfile,
  updateProfile,
};
