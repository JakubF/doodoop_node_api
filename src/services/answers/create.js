import { Op } from 'sequelize';
import { UnprocessableEntity } from '../../utils/errors';
import { Player, Answer, GameSession } from '../../models';
import validateSize from '../validations/validateSize';
import validateUniqueness from '../validations/validateUniqueness';
import gameSessionEntity from '../../entities/gameSession';
import { entityWrapper } from '../../utils/entityWrapper';

const findResource = async (model, id) => {
  const record = await model.findOne({ where: { id } });
  if (!record)
    throw new NotFound(`${model.name} with id ${id} not found.`);

  return record;
}

const service = async ({ playerId, gameSessionId, value }) => {
  const gameSession = await findResource(GameSession, gameSessionId);
  if (gameSession.status !== 'in_progress')
    throw new UnprocessableEntity('Game session must be in progress');

  const entity = await entityWrapper(gameSession, gameSessionEntity);

  if (!entity.currentRoundElement.status)
    throw new NotFound('Current song not found');
  if (entity.currentRoundElement.status !== 'playing')
    throw new UnprocessableEntity('Can only answer currently playing songs');

  const player = await findResource(Player, playerId);
  await validateSize('answer', value, { from: 1, to: 100 });
  await validateUniqueness(Answer, 'playerId', player.id, { roundElementId: { [Op.eq]: entity.currentRoundElement.id }}, Op.eq);

  return await Answer.create({ playerId: player.id, roundElementId: entity.currentRoundElement.id, value, createdAt: new Date(), updatedAt: new Date() });
};

export default service;