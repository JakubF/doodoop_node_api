import { UnprocessableEntity } from '../../utils/errors';
import { GameSession } from '../../models';
import { Op } from 'sequelize';

const validateName = async (name) => {
  if (!name) {
    throw new UnprocessableEntity({ name: 'must be filled' });
  }
  if (name.length < 5) {
    console.log(name);
    throw new UnprocessableEntity({ name: 'must be at least 5 characters long' });
  }
  if (name.length > 50) {
    throw new UnprocessableEntity({ name: "can't be longer than 50 characters" });
  }
  const count = await GameSession.count({ where: { name: { [Op.iLike]: name } } })
  console.log('count', count)
  if (count > 0) {
    throw new UnprocessableEntity({ name: "name must be unique" });
  }
}

const generateEnterCode = () => {
  return Math.random().toString(36).substring(6);
}

const service = async ({ name }) => {
  await validateName(name);
  const enterCode = generateEnterCode();
  console.log('dupa xDD', enterCode);
  return await GameSession.create({ name, enterCode, status: 'pending', createdAt: new Date(), updatedAt: new Date() })
};

export default service;