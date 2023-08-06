const statusCode = require('http2').constants;

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = statusCode.HTTP_STATUS_NOT_FOUND;
  }
}

module.exports = NotFoundError;
