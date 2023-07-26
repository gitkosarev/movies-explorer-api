const statusCode = require('http2').constants;

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = statusCode.HTTP_STATUS_CONFLICT;
  }
}

module.exports = ConflictError;
