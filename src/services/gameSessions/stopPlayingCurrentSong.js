import { GameSession } from '../../models';
import { NotFound, UnprocessableEntity } from '../../utils/errors';
import gameSessionEntity from '../../entities/gameSession';
import { entityWrapper } from '../../utils/entityWrapper';
import completeGameSession from './complete';
import broadcastEvent from '../../utils/broadcastEvent';

const service = async ({ id }) => {
  const record = await GameSession.findOne({ where: { id } })
  if (!record)
    throw new NotFound(`GameSession with id ${id} not found.`);
  if (record.status !== 'in_progress')
    throw new UnprocessableEntity('Game session must be in progress');

  const entity = await entityWrapper(record, gameSessionEntity);
  if (!entity.currentRoundElement)
    throw new UnprocessableEntity('Missing round element');
  if (entity.currentRoundElement.status !== 'playing')
    throw new UnprocessableEntity('Round Element is not playing');

  const currentRoundElement = await entity.currentRoundElement.update({ status: 'completed', updatedAt: new Date() });

  broadcastEvent('songEnded', { id: record.id, roundElementId: entity.currentRoundElement.id });
  if (entity.areAllRoundElementsCompleted())
    completeGameSession({ record });

  return currentRoundElement
};

export default service;