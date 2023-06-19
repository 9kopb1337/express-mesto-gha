const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');
const { ERROR_NOT_FOUND } = require('./errors/error');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '648b6b448bba69f325420a77',
  };
  next();
});

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(router);

app.use('/', (req, res) => {
  res.status(ERROR_NOT_FOUND).send({ message: 'Something went wrong' });
});

app.get('/', (req, res) => {
  res.send('hello world!');
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
