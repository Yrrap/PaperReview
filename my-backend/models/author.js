// models/author.js
module.exports = (sequelize, DataTypes) => {
  const Author = sequelize.define('Author', {
    name: DataTypes.STRING,
    orcid_id: DataTypes.STRING
  });

  Author.associate = (models) => {
    // Associate Author with Paper through the PaperAuthors table
    Author.belongsToMany(models.Paper, {
      through: 'PaperAuthors',
      foreignKey: 'author_id'
    });
  };

  return Author;
};