const express = require('express');
const router = express.Router();


// comment.js
// GET all comments
router.get('/', (req, res) => {
    // Implementation will go here

    // res.send('GET HTTP method on comment resource');
    res.json({
        message: 'GET HTTP method on comment resource',
    });
});

// GET a single comment by ID
router.get('/:id', (req, res) => {
    // Implementation will go here

    // res.send('GET HTTP method on comment resource');
    res.json({
        message: 'GET HTTP method on comment resource',
    });
});

// POST a new comment
router.post('/', (req, res) => {
    // Implementation will go here
    // res.send('POST HTTP method on comment resource');
    res.json({
        message: 'POST HTTP method on comment resource',
    });
});

// ... additional routes for PUT and DELETE
// PUT updated data in a comment
router.put('/:id', (req, res) => {
    // Implementation will go here
    // res.send('PUT HTTP method on comment resource');
    res.json({
        message: 'PUT HTTP method on comment resource',
    });
});

// DELETE a comment
router.delete('/:id', (req, res) => {
    // Implementation will go here
    // res.send('DELETE HTTP method on comment resource');
    res.json({
        message: 'DELETE HTTP method on comment resource',
    });
});

// Export the router
module.exports = router;
