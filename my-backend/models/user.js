// models/user.js
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      orcid_id: DataTypes.STRING
    });
  
    User.associate = (models) => {
      // Associate User with Comment
      User.hasMany(models.Comment, {
        foreignKey: 'user_id'
      });
    };
  
    return User;
  };