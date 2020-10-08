'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RoundElement extends Model {
    static associate(models) {
      RoundElement.belongsTo(models.GameSession, { foreignKey: 'gameSessionId', as: 'gameSession' });
      RoundElement.hasMany(models.Answer, { foreignKey: 'roundElementId', as: 'answers' });
    }
  };
  RoundElement.init({
    name: DataTypes.STRING,
    answer: DataTypes.STRING,
    status: DataTypes.ENUM('pending', 'started', 'playing', 'completed'),
    points: DataTypes.INTEGER,
    gameSessionId: DataTypes.INTEGER,
    link: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'RoundElement',
  });
  return RoundElement;
};