class HttpError extends Error {
  constructor(message, errorCode) {
    super(message); // Add a message property to build in Error
    this.code = errorCode; // Add a error code property to the build in Error
  }
}

module.exports = HttpError;
