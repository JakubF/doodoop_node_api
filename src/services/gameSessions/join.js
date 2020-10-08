import { GameSession, Player } from '../../models';
import { NotFound, UnprocessableEntity } from '../../utils/errors';

const findGameSession = async (enterCode) => {
  const gameSession = await GameSession.findOne({ where: { enterCode } });
  if (!gameSession)
    throw new NotFound(`GameSession with enterCode ${enterCode} not found.`);
  if (gameSession.status !== 'pending')
    throw new UnprocessableEntity('Only pending games can be joined');

  return gameSession;
}

const service = async ({ enterCode, name }) => {
  const gameSession = await findGameSession(enterCode)

  const player = await Player.findOne({ where: { gameSessionId: gameSession.id, name } });
  if (player && player.id) 
    return await player.update({ updatedAt: new Date() });
  else
    return await Player.create({ name, gameSessionId: gameSession.id, createdAt: new Date(), updatedAt: new Date() });
};

export default service;