const express = require('express');
const mongoose = require('mongoose');
const CookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const router = require('./routes');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(CookieParser());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(router);

app.use(errors());

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
