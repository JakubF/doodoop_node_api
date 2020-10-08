'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RoundElement extends Model {
    static associate(models) {
      RoundElement.belongsTo(models.GameSession, { foreignKey: 'gameSessionId', as: 'gameSession' });
      RoundElement.hasMany(models.Answer, { foreignKey: 'roundElementId' });
    }
  };
  RoundElement.init({
    name: DataTypes.STRING,
    answer: DataTypes.STRING,
    status: DataTypes.STRING,
    points: DataTypes.INTEGER,
    gameSessionId: DataTypes.INTEGER,
    link: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'RoundElement',
  });
  return RoundElement;
};