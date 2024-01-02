const { Author } = require('../models');

const getAuthors = async (req, res) => {
  try {
    const authors = await Author.findAll();
    res.json(authors);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// More CRUD functions for authors
const getAuthorById = async (req, res) => {
  try {
    const author = await Author.findByPk(req.params.id);
    if (author) {
      res.json(author);
    } else {
      res.status(404).send('Author not found');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const createAuthor = async (req, res) => {
    try {
        const author = await Author.create(req.body);
        res.json(author);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const updateAuthor = async (req, res) => {
    try {
        const author = await Author.findByPk(req.params.id);
        if (author) {
            await author.update(req.body);
            res.json(author);
        } else {
            res.status(404).send('Author not found');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const deleteAuthor = async (req, res) => {
    try {
        const author = await Author.findByPk(req.params.id);
        if (author) {
            await author.destroy();
            res.json(author);
        } else {
            res.status(404).send('Author not found');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
};

module.exports = {
    getAuthors,
    getAuthorById,
    createAuthor,
    updateAuthor,
    deleteAuthor,
};
