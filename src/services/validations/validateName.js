import { UnprocessableEntity } from '../../utils/errors';
import { Op } from 'sequelize';

const validateName = async (model, name) => {
  if (!name) {
    throw new UnprocessableEntity({ name: 'must be filled' });
  }
  if (name.length < 5) {
    throw new UnprocessableEntity({ name: 'must be at least 5 characters long' });
  }
  if (name.length > 50) {
    throw new UnprocessableEntity({ name: "can't be longer than 50 characters" });
  }
  const count = await model.count({ where: { name: { [Op.iLike]: name } } })
  if (count > 0) {
    throw new UnprocessableEntity({ name: "name must be unique" });
  }
}

export default validateName;