import { GameSession } from '../../models';
import validateName from '../validations/validateName';

const generateEnterCode = () => {
  return Math.random().toString(36).substring(6);
}

const service = async ({ name }) => {
  await validateName(GameSession, name);
  const enterCode = generateEnterCode();
  return await GameSession.create({ name, enterCode, status: 'pending', createdAt: new Date(), updatedAt: new Date() })
};

export default service;