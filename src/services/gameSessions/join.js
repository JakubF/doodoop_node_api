import { GameSession, Player } from '../../models';
import { NotFound, UnprocessableEntity } from '../../utils/errors';
import gameSessionEntity from '../../entities/gameSession';
import { entityWrapper } from '../../utils/entityWrapper';
import validateSize from '../validations/validateSize';

const includes = [
  { model: GameSession, required: false, as: 'gameSession' },
]

const findGameSession = async (enterCode) => {
  const gameSession = await GameSession.findOne({ where: { enterCode } });
  if (!gameSession)
    throw new NotFound(`GameSession with enterCode ${enterCode} not found.`);
  const entity = await entityWrapper(gameSession, gameSessionEntity);
  if (gameSession.status !== 'pending' && entity.currentRoundElement && entity.currentRoundElement.status !== 'pending')
    throw new UnprocessableEntity('Only pending games can be joined');

  return gameSession;
}

const service = async ({ enterCode, name }) => {
  const gameSession = await findGameSession(enterCode)

  await validateSize('name', name, { from: 4, to: 15 });

  const player = await Player.findOne({ where: { gameSessionId: gameSession.id, name }, include: includes });
  if (player && player.id) 
    return await player.update({ updatedAt: new Date() });
  else
    return await Player.create({ name, gameSessionId: gameSession.id, points: 0, createdAt: new Date(), updatedAt: new Date() }, { include: includes });
};

export default service;