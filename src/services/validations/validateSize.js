import validatePresence from './validatePresence';
import { UnprocessableEntity } from '../../utils/errors';

const validateSize = async (fieldName, value, options = { from: 5, to: 50}) => {
  await validatePresence(fieldName, value);
  if (options.from && value.length < options.from) {
    throw new UnprocessableEntity({ [fieldName]: `must be at least ${options.from} characters long` });
  }
  if (options.to && value.length > options.to) {
    throw new UnprocessableEntity({ [fieldName]: `can't be longer than ${options.to} characters` });
  }
}

export default validateSize;