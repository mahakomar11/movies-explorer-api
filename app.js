const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const router = require('./routes/index')

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

app.use(router);

app.listen(3000);
