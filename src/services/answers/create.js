import { UnprocessableEntity } from '../../utils/errors';
import { Player, Answer, RoundElement } from '../../models';
import validateSize from '../validations/validateSize';
import validateUniqueness from '../validations/validateUniqueness';
import { Op } from 'sequelize';

const findResource = async (model, id) => {
  const record = await model.findOne({ where: { id } });
  if (!record)
    throw new NotFound(`${model.name} with id ${id} not found.`);

  return record;
}

const service = async ({ playerId, roundElementId, value }) => {
  const roundElement = await findResource(RoundElement, roundElementId);
  if (roundElement.status !== 'playing')
    throw new UnprocessableEntity('Can only answer current songs');
  const player = await findResource(Player, playerId);
  await validateSize('answer', value, { from: 1, to: 100 });
  await validateUniqueness(Answer, 'playerId', player.id, { roundElementId: { [Op.eq]: roundElement.id }}, Op.eq);

  return await Answer.create({ playerId: player.id, roundElementId: roundElement.id, value, createdAt: new Date(), updatedAt: new Date() });
};

export default service;