import { RoundElement } from '../../models';
import { NotFound } from '../../utils/errors';

const service = async ({ id }) => {
  const record = await RoundElement.findOne({ where: { id } })
  if (!record)
    throw new NotFound(`Record with id ${id} not found.`)
  await record.destroy();
  return true;
};

export default service;