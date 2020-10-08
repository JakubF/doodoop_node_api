import { GameSession } from '../../models';
import validateName from '../validations/validateName';
import { NotFound } from '../../utils/errors';

const service = async ({ id, name }) => {
  const record = await GameSession.findOne({ where: { id } })
  if (!record)
    throw new NotFound(`Record with id ${id} not found.`)
  if (name === record.name)
    return record
  await validateName(GameSession, name);

  return await record.update({ name, updatedAt: new Date() });
};

export default service;