const express = require('express');
const router = express.Router();


// author.js
// GET all authors
router.get('/', (req, res) => {
    // Implementation will go here

    // res.send('GET HTTP method on author resource');
    res.json({
        message: 'GET HTTP method on author resource',
    });
});

// GET a single author by ID
router.get('/:id', (req, res) => {
    // Implementation will go here

    // res.send('GET HTTP method on author resource');
    res.json({
        message: 'GET HTTP method on author resource',
    });
});

// POST a new author
router.post('/', (req, res) => {
    // Implementation will go here
    // res.send('POST HTTP method on author resource');
    res.json({
        message: 'POST HTTP method on author resource',
    });
});

// ... additional routes for PUT and DELETE
// PUT updated data in a author
router.put('/:id', (req, res) => {
    // Implementation will go here
    // res.send('PUT HTTP method on author resource');
    res.json({
        message: 'PUT HTTP method on author resource',
    });
});

// DELETE a author
router.delete('/:id', (req, res) => {
    // Implementation will go here
    // res.send('DELETE HTTP method on author resource');
    res.json({
        message: 'DELETE HTTP method on author resource',
    });
});

// Export the router
module.exports = router;
