const statusCode = require('http2').constants;

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = statusCode.HTTP_STATUS_BAD_REQUEST;
  }
}

module.exports = BadRequestError;
