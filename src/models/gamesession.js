'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class GameSession extends Model {
    static associate(models) {
      GameSession.hasMany(models.RoundElement, { foreignKey: 'gameSessionId', as: 'roundElements' });
      GameSession.hasMany(models.Player, { foreignKey: 'gameSessionId', as: 'players' });
    }
  };
  GameSession.init({
    name: DataTypes.STRING,
    enterCode: DataTypes.STRING,
    status: DataTypes.ENUM('pending', 'in_progress', 'completed')
  }, {
    sequelize,
    modelName: 'GameSession',
  });
  return GameSession;
};