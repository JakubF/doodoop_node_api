import { GeneralError } from '../utils/errors';

const handleErrors = (err, req, res, next) => {
  if (err instanceof GeneralError) {
    return res.status(err.getCode()).json({
      data: err.message
    });
  }

  return res.status(500).json({
    data: err.message
  });
}


export default handleErrors;