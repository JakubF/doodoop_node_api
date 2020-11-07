import findRoundElement from './utils/findRoundElement';

const service = async ({ id }) => {
  const record = await findRoundElement(id);

  await record.destroy();
  return true;
};

export default service;