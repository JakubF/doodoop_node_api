import { GameSession } from '../../models';
import validateName from '../validations/validateName';
import validateUniqueness from '../validations/validateUniqueness';

const generateEnterCode = () => {
  return Math.random().toString(36).substring(6);
}

const service = async ({ name }) => {
  await validateName(name);
  await validateUniqueness(GameSession, 'name', name);
  const enterCode = generateEnterCode();
  return await GameSession.create({ name, enterCode, status: 'pending', createdAt: new Date(), updatedAt: new Date() });
};

export default service;