import { RoundElement, Answer, Player } from '../../models';
import { NotFound, UnprocessableEntity } from '../../utils/errors';

const service = async ({ roundElementId, answerId }) => {
  const record = await RoundElement.findOne({ where: { id: roundElementId } });
  if (!record)
    throw new NotFound(`RoundElement with id ${id} not found.`);
  const answer = await Answer.findOne({ where: { id: answerId }, include: [{ model: Player, required: false, as: 'player' }] });
  if (!answer)
    throw new NotFound(`Answer with id ${answerId} not found.`);

  if (record.status !== 'completed')
    throw new UnprocessableEntity('Round Element must finish playing');
  if (!!record.winnerId)
    throw new UnprocessableEntity('Round Element already has a winner');

  await answer.player.update({ points: ((answer.player.points || 0) + record.points) });
  return await record.update({ winnerId: answer.playerId, updatedAt: new Date() });
};

export default service;