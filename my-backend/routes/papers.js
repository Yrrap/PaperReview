const express = require('express');
const router = express.Router();
const papersController = require('../controllers/papersController');

router.get('/', papersController.getAllPapers);
router.get('/:id', papersController.getPaperById);
router.post('/', papersController.createPaper);
router.put('/:id', papersController.updatePaper);
router.delete('/:id', papersController.deletePaper);

// Export the router
module.exports = router;
