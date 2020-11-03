import { GameSession } from '../../models';
import { NotFound, UnprocessableEntity } from '../../utils/errors';
import gameSessionEntity from '../../entities/gameSession';
import { entityWrapper } from '../../utils/entityWrapper';
import { broadcastEvent } from '../../utils/broadcastEvent';

const service = async ({ id }) => {
  const record = await GameSession.findOne({ where: { id } })
  if (!record)
    throw new NotFound(`GameSession with id ${id} not found.`);
  if (record.status !== 'in_progress')
    throw new UnprocessableEntity('Game session must be in progress');

  const entity = await entityWrapper(record, gameSessionEntity);
  if (!entity.currentRoundElement)
    throw new UnprocessableEntity('Missing round element');
  if (entity.currentRoundElement.status !== 'started')
    throw new UnprocessableEntity('Round Element is not started');

  broadcastEvent('songStarted', { id: record.id, roundElementId: entity.currentRoundElement.id });

  return await entity.currentRoundElement.update({ status: 'playing', updatedAt: new Date() });
};

export default service;