import validatePresence from './validatePresence';
import { UnprocessableEntity } from '../../utils/errors';

const validateName = async (name) => {
  await validatePresence('name', name);
  if (name.length < 5) {
    throw new UnprocessableEntity({ name: 'must be at least 5 characters long' });
  }
  if (name.length > 50) {
    throw new UnprocessableEntity({ name: "can't be longer than 50 characters" });
  }
}

export default validateName;