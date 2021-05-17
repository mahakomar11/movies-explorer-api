const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const { errors, celebrate, Joi } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');
const handleErrors = require('./middlewares/errors');
const CustomError = require('./utils/errors');

const app = express();

const { NODE_ENV, DB_URL } = process.env;

mongoose.connect(
  NODE_ENV === 'production' ? DB_URL : 'mongodb://localhost:27017/moviesdb',
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  }
);

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required().min(8),
    }),
  }),
  login
);
app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string(),
      email: Joi.string().email().required(),
      password: Joi.string().required().min(8),
    }),
  }),
  createUser
);

app.use(auth);
app.use('/users', usersRouter);
app.use('/movies', moviesRouter);
app.use(errors());
app.use('*', (req, res, next) => {
  next(new CustomError(404, 'Запрашиваемая страница не найдена'));
});
app.use(errorLogger);
app.use(handleErrors);

app.listen(3000);
