import { Op } from 'sequelize';
import { RoundElement, Answer } from '../models';

const gameSession = async (record) => {
  const currentRoundElement = await RoundElement.findOne({
    where: { gameSessionId: record.id, status: { [Op.ne]: 'completed' } },
    order: [['id', 'ASC']],
    include: [{ model: Answer, required: false, as: 'answers' },]
  })
 return {
   currentRoundElement
 }
}

export default gameSession;