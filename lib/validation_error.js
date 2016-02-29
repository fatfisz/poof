class ValidationError extends Error {
  constructor(fields) {
    super();
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.fields = fields;
  }
}

ValidationError.prototype.name = 'ValidationError';

export default ValidationError;
