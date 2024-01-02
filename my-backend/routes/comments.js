const express = require('express');
const commentsController = require('../controllers/commentsController');
const router = express.Router();

router.get('/', commentsController.getAllComments);
router.get('/:id', commentsController.getCommentById);
router.post('/', commentsController.createComment);
router.put('/:id', commentsController.updateComment);
router.delete('/:id', commentsController.deleteComment);

// Export the router
module.exports = router;
