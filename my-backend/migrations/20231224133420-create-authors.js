'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Authors', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      author_name: {
        type: Sequelize.STRING
      },
      author_url: {
        type: Sequelize.STRING
      },
      // Add createdAt and updatedAt fields
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

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Authors');
  }
};
