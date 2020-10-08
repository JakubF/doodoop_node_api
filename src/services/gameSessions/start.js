import { GameSession } from '../../models';
import { NotFound, UnprocessableEntity } from '../../utils/errors';

const service = async ({ id }) => {
  const record = await GameSession.findOne({ where: { id } })
  if (!record)
    throw new NotFound(`Record with id ${id} not found.`)
  if (record.status === 'in_progress')
    return record
  if (record.status === 'completed')
    throw new UnprocessableEntity('Game session already completed')

  return await record.update({ status: 'in_progress', updatedAt: new Date() });
};

export default service;