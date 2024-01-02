const express = require('express');
const authorsController = require('../controllers/authorsController');
const router = express.Router();

router.get('/', authorsController.getAllAuthors);
router.get('/:id', authorsController.getAuthorById);
router.post('/', authorsController.createAuthor);
router.put('/:id', authorsController.updateAuthor);
router.delete('/:id', authorsController.deleteAuthor);

// Export the router
module.exports = router;
