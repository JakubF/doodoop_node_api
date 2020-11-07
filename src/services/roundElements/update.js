import { RoundElement, GameSession } from '../../models';
import validateSize from '../validations/validateSize';
import validateUniqueness from '../validations/validateUniqueness';
import validatePresence from '../validations/validatePresence';
import { NotFound, UnprocessableEntity } from '../../utils/errors';

const findRoundElement = async (id) => {
  const record = await RoundElement.findOne({ where: { id }, include: [{ model: GameSession, required: false, as: 'gameSession' }] })
  if (!record)
    throw new NotFound(`Record with id ${id} not found.`)
  if (record.gameSession.status !== 'pending')
    throw new UnprocessableEntity('Only pending games can edited');
  return record
}

const validateInput = async (record, params) => {
  const attributes = { updatedAt: new Date() };

  if (params.hasOwnProperty('name') && params.name !== record.name) {
    await validateSize('name', params.name);
    await validateUniqueness(RoundElement, 'name', params.name, { gameSessionId: record.gameSessionId });
    attributes.name = params.name;
  }

  if (params.hasOwnProperty('link') && params.link !== record.name) {
    await validatePresence('link', params.link);
    attributes.link = params.link;
  }

  if (params.hasOwnProperty('answer') && params.answer !== record.name) {
    await validatePresence('answer', params.answer);
    attributes.answer = params.answer;
  }

  if (params.hasOwnProperty('points') && params.points !== record.name) {
    await validatePresence('points', params.points);
    attributes.points = params.points;
  }
  return attributes;
}

const service = async ({ id, ...params }) => {
  const record = await findRoundElement(id);
  const attributes = await validateInput(record, params);

  return await record.update(attributes);
};

export default service;