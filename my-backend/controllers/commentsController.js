const { Comment } = require('../models');

const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.findAll();
    res.json(comments);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// More CRUD functions for comments
const getCommentById = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (comment) {
      res.json(comment);
    } else {
      res.status(404).send('Comment not found');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const createComment = async (req, res) => {
    try {
        const comment = await Comment.create(req.body);
        res.json(comment);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const updateComment = async (req, res) => {
    try {
        const comment = await Comment.findByPk(req.params.id);
        if (comment) {
            await comment.update(req.body);
            res.json(comment);
        } else {
            res.status(404).send('Comment not found');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findByPk(req.params.id);
        if (comment) {
            await comment.destroy();
            res.json(comment);
        } else {
            res.status(404).send('Comment not found');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
};

module.exports = {
    getAllComments,
    getCommentById,
    createComment,
    updateComment,
    deleteComment
};
