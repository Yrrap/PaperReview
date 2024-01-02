const express = require('express');
const app = express();
const papersRoutes = require('./routes/papers');
const authorsRoutes = require('./routes/authors');
const commentsRoutes = require('./routes/comments');
const usersRoutes = require('./routes/users');
const { sequelize } = require('./models');

// Middleware to parse JSON bodies
app.use(express.json());
app.use('/api/papers', papersRoutes);
app.use('/api/authors', authorsRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/users', usersRoutes);

// Define a port number
const PORT = process.env.PORT || 3001;

// A simple route for GET request on the root URL ('/')
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
