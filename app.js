require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3001, MONGO_URL = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;
const app = express();
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
});
app.use(express.json());
app.use(requestLogger);
app.use(router);
app.use(errorLogger);
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT);
