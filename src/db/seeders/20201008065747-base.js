'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('GameSessions', [
      { name: "Doodoop Quiz 1", enterCode: 'KZWS', status: 'pending', createdAt: new Date(), updatedAt: new Date() },
      { name: "Clarus Quiz 1", enterCode: 'AQUT', status: 'pending', createdAt: new Date(), updatedAt: new Date() }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('GameSessions', null, {});
  }
};
