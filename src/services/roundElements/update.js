import { RoundElement } from '../../models';
import validateSize from '../validations/validateSize';
import validateUniqueness from '../validations/validateUniqueness';
import validatePresence from '../validations/validatePresence';
import { NotFound } from '../../utils/errors';

const service = async ({ id, name, answer, link, points = 100 }) => {
  const record = await RoundElement.findOne({ where: { id } })
  if (!record)
    throw new NotFound(`Record with id ${id} not found.`)
  if (name && name !== record.name) {
    await validateSize('name', name);
    await validateUniqueness(RoundElement, 'name', name);
  }
  if (link && link !== record.link)
    await validatePresence('link', link);
  if (points && points !== record.points)
    await validatePresence('points', points);
  if (answer && answer !== record.answer)
    await validatePresence('answer', answer);

  return await record.update({ name, points, link, updatedAt: new Date() });
};

export default service;