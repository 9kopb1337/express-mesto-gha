const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');
const { PORT = 3000 } = process.env;
const app = express();
app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '647f6834ca5b012549193198'
  }
  next();
})
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
app.use(router);
app.use('/', (req, res) => {
  res.status(404).send({message: `Something went wrong`});
})

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})

