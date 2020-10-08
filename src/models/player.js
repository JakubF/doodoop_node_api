'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Player extends Model {
    static associate(models) {
      Player.belongsTo(models.GameSession, { foreignKey: 'gameSessionId', as: 'gameSession' });
    }
  };
  Player.init({
    name: DataTypes.STRING,
    gameSessionId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Player',
  });
  return Player;
};