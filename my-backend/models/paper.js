// models/paper.js
module.exports = (sequelize, DataTypes) => {
    const Paper = sequelize.define('Paper', {
      title: DataTypes.STRING,
      abstract: DataTypes.TEXT,
      arxiv_id: DataTypes.STRING,
      url: DataTypes.STRING
    });
  
    Paper.associate = (models) => {
        // Associate Paper with Author through the PaperAuthors table
        Paper.belongsToMany(models.Author, {
          through: 'PaperAuthors',
          foreignKey: 'paper_id'
        });
        // You can also add associations with Comments here
        Paper.hasMany(models.Comment, {
          foreignKey: 'paper_id'
        });
      };
    
      return Paper;
};