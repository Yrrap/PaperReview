// models/comment.js
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    text: DataTypes.TEXT,
    timestamp: DataTypes.DATE
  });

  Comment.associate = (models) => {
    // Associate Comment with Paper
    Comment.belongsTo(models.Paper, {
      foreignKey: 'paper_id'
    });
    // Associate Comment with User
    Comment.belongsTo(models.User, {
      foreignKey: 'user_id'
    });
  };

  return Comment;
};