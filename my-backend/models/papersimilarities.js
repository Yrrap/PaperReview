// models/papersimilarities.js
module.exports = (sequelize, DataTypes) => {
    const PaperSimilarities = sequelize.define('PaperSimilarities', {
        paper_id1: DataTypes.INTEGER,
        paper_id2: DataTypes.INTEGER,
        similarity: DataTypes.STRING
    });

    return PaperSimilarities;
};