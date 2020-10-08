import { UnprocessableEntity } from '../../utils/errors';
import { Op } from 'sequelize';

const validateUniqueness = async (model, field, value, scope = {}) => {
  const count = await model.count({ where: { [field]: { [Op.iLike]: value }, ...scope } })
  if (count > 0) {
    throw new UnprocessableEntity({ [field]: `${field} must be unique` });
  }
}

export default validateUniqueness;
