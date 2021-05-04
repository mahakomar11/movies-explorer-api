const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const auth = require('./middlewares/auth');
const {login, createUser} = require('./controllers/users');
const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');

const app = express();

mongoose.connect('mongodb://localhost:27017/moviesdb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use((req, res, next) => {
//   req.userId = '6091408a3b3100b5a9dd519a';
//   next();
// });
app.post('/signin', login);
app.post('/signup', createUser)
app.use(auth);
app.use('/users', usersRouter);
app.use('/movies', moviesRouter);

app.listen(3000);
