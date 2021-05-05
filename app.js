const express = require('express');
require('dotenv').config();
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { errors, celebrate, Joi } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');
const handleErrors = require('./middlewares/errors');

const app = express();

mongoose.connect('mongodb://localhost:27017/moviesdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required(),
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
      email: Joi.string().required(),
      password: Joi.string().required().min(8),
    }),
  }),
  createUser
);

app.use(auth);
app.use('/users', usersRouter);
app.use('/movies', moviesRouter);
app.use(errorLogger);
app.use(errors());
app.use(handleErrors);
app.use('*', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемая страница не найдена' });
});

app.listen(3000);
