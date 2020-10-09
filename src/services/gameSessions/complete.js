import broadcastEvent from '../../utils/broadcastEvent';

const service = async ({ record }) => {
  broadcastEvent('gameSessionEnded', { id: record.id });

  return await record.update({ status: 'completed', updatedAt: new Date() });
};

export default service;