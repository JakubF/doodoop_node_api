import { GameSession, RoundElement } from '../../models';
import validateSize from '../validations/validateSize';
import validateUniqueness from '../validations/validateUniqueness';
import validatePresence from '../validations/validatePresence';
import { UnprocessableEntity } from '../../utils/errors';

const findGameSession = async (gameSessionId) => {
  const gameSession = await GameSession.findOne({ where: { id: gameSessionId } });
  if (!gameSession)
    throw new NotFound(`GameSession with id ${gameSessionId} not found.`);
  if (gameSession.status !== 'pending')
    throw new UnprocessableEntity('Only pending games can edited');

  return gameSession;
}

const service = async ({ gameSessionId, name, answer, link, points = 100 }) => {
  const gameSession = await findGameSession(gameSessionId)
  await validateSize('name', name);
  await validateUniqueness(RoundElement, 'name', name);
  await validatePresence('link', link);
  await validatePresence('points', points);
  await validatePresence('answer', answer);

  return await RoundElement.create({ name, points, link, status: 'pending', gameSessionId: gameSession.id, createdAt: new Date(), updatedAt: new Date() });
};

export default service;