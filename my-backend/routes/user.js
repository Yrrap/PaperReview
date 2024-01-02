const express = require('express');
const router = express.Router();


// user.js
// GET all users
router.get('/', (req, res) => {
    // Implementation will go here

    // res.send('GET HTTP method on user resource');
    res.json({
        message: 'GET HTTP method on user resource',
    });
});

// GET a single user by ID
router.get('/:id', (req, res) => {
    // Implementation will go here

    // res.send('GET HTTP method on user resource');
    res.json({
        message: 'GET HTTP method on user resource',
    });
});

// POST a new user
router.post('/', (req, res) => {
    // Implementation will go here
    // res.send('POST HTTP method on user resource');
    res.json({
        message: 'POST HTTP method on user resource',
    });
});

// ... additional routes for PUT and DELETE
// PUT updated data in a user
router.put('/:id', (req, res) => {
    // Implementation will go here
    // res.send('PUT HTTP method on user resource');
    res.json({
        message: 'PUT HTTP method on user resource',
    });
});

// DELETE a user
router.delete('/:id', (req, res) => {
    // Implementation will go here
    // res.send('DELETE HTTP method on user resource');
    res.json({
        message: 'DELETE HTTP method on user resource',
    });
});

// Export the router
module.exports = router;
