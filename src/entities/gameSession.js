import { Op } from 'sequelize';
import { RoundElement, Answer, Player } from '../models';

const gameSession = async (record) => {
  const currentRoundElement = await RoundElement.findOne({
    where: { gameSessionId: record.id, status: { [Op.ne]: 'completed' } },
    order: [['id', 'ASC']],
    include: [{
      model: Answer,
      required: false,
      as: 'answers',
      include: [
        {
          model: RoundElement,
          required: false,
          as: 'roundElement'
        },
        {
          model: Player,
          required: false,
          as: 'player'
        },
      ]
    }],
  })
 return {
   currentRoundElement
 }
}

export default gameSession;