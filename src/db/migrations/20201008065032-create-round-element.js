'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('RoundElements', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      answer: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      points: {
        type: Sequelize.INTEGER
      },
      gameSessionId: {
        type: Sequelize.INTEGER,
        references: { model: 'GameSessions', key: 'id' }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('RoundElements');
  }
};