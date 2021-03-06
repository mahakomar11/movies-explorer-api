const jwt = require('jsonwebtoken');
const CustomError = require('../utils/errors');

const auth = (req, res, next) => {
  if (!req.get('Authorization'))
    return next(new CustomError(401, 'Необходима авторизация'));

  const token = req.get('Authorization').replace('Bearer ', '');

  const { NODE_ENV, JWT_SECRET } = process.env;

  let payload;
  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'
    );
  } catch (err) {
    return next(new CustomError(401, 'Необходима авторизация'));
  }

  req.user = payload;
  return next();
};

module.exports = auth;
