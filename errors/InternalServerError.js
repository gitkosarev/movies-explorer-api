const statusCode = require('http2').constants;

class InternalServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = statusCode.HTTP_STATUS_INTERNAL_SERVER_ERROR;
  }
}

module.exports = InternalServerError;
