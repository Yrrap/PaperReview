// models/papercitations.js
module.exports = (sequelize, DataTypes) => {
  const PaperCitations = sequelize.define('PaperCitations', {
    citing_paper_id: DataTypes.INTEGER,
    cited_paper_id: DataTypes.INTEGER
  });

  return PaperCitations;
};