const Sequelize = require('sequelize');
const config = require('../config/config.json').development;

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: 'postgres'
});

// Import models
const Paper = require('./paper')(sequelize, Sequelize.DataTypes);
const Author = require('./author')(sequelize, Sequelize.DataTypes);
const Comment = require('./comment')(sequelize, Sequelize.DataTypes);
const User = require('./user')(sequelize, Sequelize.DataTypes);
const PaperAuthors = require('./paperauthors')(sequelize, Sequelize.DataTypes);

// Set up associations
Object.keys(sequelize.models).forEach((modelName) => {
  if ('associate' in sequelize.models[modelName]) {
    sequelize.models[modelName].associate(sequelize.models);
  }
});

// Export the sequelize connection and the models
module.exports = {
  sequelize,
  Sequelize,
  Paper,
  Author,
  Comment,
  User,
  PaperAuthors
};
