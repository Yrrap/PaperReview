const { Paper } = require('../models');

const getPapers = async (req, res) => {
  try {
    const papers = await Paper.findAll();
    res.json(papers);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getPaperById = async (req, res) => {
  try {
    const paper = await Paper.findByPk(req.params.id);
    if (paper) {
      res.json(paper);
    } else {
      res.status(404).send('Paper not found');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Other CRUD functions like createPaper, updatePaper, deletePaper, etc.

const createPaper = async (req, res) => {
    try {
        const paper = await Paper.create(req.body);
        res.json(paper);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const updatePaper = async (req, res) => {
    try {
        const paper = await Paper.findByPk(req.params.id);
        if (paper) {
            await paper.update(req.body);
            res.json(paper);
        } else {
            res.status(404).send('Paper not found');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const deletePaper = async (req, res) => {
    try {
        const paper = await Paper.findByPk(req.params.id);
        if (paper) {
            await paper.destroy();
            res.json(paper);
        } else {
            res.status(404).send('Paper not found');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
};

module.exports = {
    getPapers,
    getPaperById,
    createPaper,
    updatePaper,
    deletePaper,
};
