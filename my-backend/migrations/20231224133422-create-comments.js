'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Comments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER 
      },
      paper_id: {
        type: Sequelize.INTEGER
      },
      comment: {
        type: Sequelize.TEXT
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
    await queryInterface.dropTable('Comments');    
  }
};
