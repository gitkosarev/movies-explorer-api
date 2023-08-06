const statusCode = require('http2').constants;

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = statusCode.HTTP_STATUS_UNAUTHORIZED;
  }
}

module.exports = UnauthorizedError;
