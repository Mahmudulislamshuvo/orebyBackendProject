class apiError {
  constructor(success = false, data, message, error = true) {
    (this.success = success),
      (this.data = data),
      (this.message = message),
      (this.error = error);
  }
}

module.exports = { apiError };
