import { Op } from 'sequelize';
import { RoundElement, Answer } from '../models';

const gameSession = async (record) => {
  const currentRoundElement = await RoundElement.findOne({
    where: { gameSessionId: record.id },
    order: [['id', 'ASC']],
    include: [{ model: Answer, required: false, as: 'answers' },]
  })
  console.log("currentRoundElement", currentRoundElement)
 return {
   currentRoundElement: currentRoundElement.dataValues
 }
}

export default gameSession;