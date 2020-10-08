class GeneralError extends Error {
  constructor(message) {
    super();
    this.message = message;
  }

  getCode() {
    if (this instanceof UnprocessableEntity)
      return 422;
    if (this instanceof BadRequest)
      return 400;
    if (this instanceof NotFound)
      return 404;
    return 500;
  }
}

class UnprocessableEntity extends GeneralError { };
class BadRequest extends GeneralError { };
class NotFound extends GeneralError { };

export {
  GeneralError,
  UnprocessableEntity,
  BadRequest,
  NotFound,
};