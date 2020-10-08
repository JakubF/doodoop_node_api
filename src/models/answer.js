'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Answer extends Model {
    static associate(models) {
      Answer.belongsTo(models.RoundElement, { foreignKey: 'roundElementId', as: 'roundElement' });
      Answer.belongsTo(models.Player, { foreignKey: 'playerId', as: 'player' });
    }
  };
  Answer.init({
    playerId: DataTypes.INTEGER,
    roundElementId: DataTypes.INTEGER,
    value: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Answer',
  });
  return Answer;
};