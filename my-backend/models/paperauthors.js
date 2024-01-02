// models/paperauthors.js
module.exports = (sequelize, DataTypes) => {
    const PaperAuthors = sequelize.define('PaperAuthors', {
        paper_id: DataTypes.INTEGER,
        author_id: DataTypes.INTEGER
    });

    return PaperAuthors;
};