import { UnprocessableEntity } from '../../utils/errors';

const validatePresence = async (fieldName, field) => {
  if (!field) {
    throw new UnprocessableEntity({ [fieldName]: 'must be filled' });
  }
}

export default validatePresence;