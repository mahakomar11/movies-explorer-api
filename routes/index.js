const router = require('express').Router();
const cors = require('cors');
const bodyParser = require('body-parser');
const { errors, celebrate, Joi } = require('celebrate');
const { requestLogger, errorLogger } = require('../middlewares/logger');
const auth = require('../middlewares/auth');
const { login, createUser } = require('../controllers/users');
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const handleErrors = require('../middlewares/errors');

router.use(cors());

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.use(requestLogger);

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required(),
      password: Joi.string().required().min(8),
    }),
  }),
  login
);
router.post(
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

router.use(auth);
router.use('/users', usersRouter);
router.use('/movies', moviesRouter);
router.use(errorLogger);
router.use(errors());
router.use(handleErrors);
router.use('*', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемая страница не найдена' });
});

module.exports = router;