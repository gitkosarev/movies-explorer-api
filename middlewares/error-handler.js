const mongooseError = require('mongoose').Error;

const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ConflictError = require('../errors/ConflictError');
const InternalServerError = require('../errors/InternalServerError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports = (err, next) => {
  if (err instanceof NotFoundError
    || err instanceof ForbiddenError
    || err instanceof BadRequestError
    || err instanceof UnauthorizedError) {
    next(err);
  } else if (err instanceof mongooseError.ValidationError) {
    next(new BadRequestError(`Данные не прошли валидацию: ${err.message}`));
  } else if (err instanceof mongooseError.CastError) {
    next(new BadRequestError(`Некоректный Id: ${err.message}`));
  } else if (err instanceof mongooseError.DocumentNotFoundError) {
    next(new NotFoundError(`Объект не найден: ${err.message}`));
  } else if (err.code === 11000) {
    next(new ConflictError(`Дубль уникальных данных: ${err.message}`));
  } else {
    next(new InternalServerError('На сервере произошла ошибка'));
  }
};
