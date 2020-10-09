'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'RoundElements',
      'winnerId',
      {
        type: Sequelize.INTEGER,
        references: { model: 'GameSessions', key: 'id' }
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'RoundElements',
      'winnerId'
    );
  }
};
