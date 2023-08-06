const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { errors } = require('celebrate');
const helmet = require('helmet');

require('dotenv').config();

const router = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { defaultLimiter } = require('./middlewares/limiter');
const { handleFinalError } = require('./middlewares/errorHandler');

const { PORT = 3000, ORIGIN = 'diploma.nomoreparties.co', MONGODB_URI = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;
const app = express();

mongoose.connect(MONGODB_URI);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

app.use(cors({
  origin: ORIGIN,
}));

app.use(helmet());

app.use(defaultLimiter);

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use(handleFinalError);

app.listen(PORT);
