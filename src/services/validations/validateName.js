import { UnprocessableEntity } from '../../utils/errors';
import { Op } from 'sequelize';

const validateName = async (name) => {
  if (!name) {
    throw new UnprocessableEntity({ name: 'must be filled' });
  }
  if (name.length < 5) {
    throw new UnprocessableEntity({ name: 'must be at least 5 characters long' });
  }
  if (name.length > 50) {
    throw new UnprocessableEntity({ name: "can't be longer than 50 characters" });
  }
}

export default validateName;