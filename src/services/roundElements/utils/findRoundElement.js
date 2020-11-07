import { findBreakingChanges } from 'graphql';
import { RoundElement, GameSession } from '../../../models';
import { NotFound, UnprocessableEntity } from '../../../utils/errors';

const findRoundElement = async (id) => {
  const record = await RoundElement.findOne({ where: { id }, include: [{ model: GameSession, required: false, as: 'gameSession' }] })
  if (!record)
    throw new NotFound(`Record with id ${id} not found.`)
  if (record.gameSession.status !== 'pending')
    throw new UnprocessableEntity('Only pending games can edited');
  return record
}

export default findRoundElement;