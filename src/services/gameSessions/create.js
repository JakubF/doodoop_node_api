import { GameSession } from '../../models';
import validateSize from '../validations/validateSize';
import validateUniqueness from '../validations/validateUniqueness';

const generateEnterCode = () => {
  return Math.random().toString(36).substring(6);
}

const service = async ({ name }) => {
  await validateSize('name', name);
  await validateUniqueness(GameSession, 'name', name);
  const enterCode = generateEnterCode();
  return await GameSession.create({ name, enterCode, status: 'pending', createdAt: new Date(), updatedAt: new Date() });
};

export default service;