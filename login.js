
const express = require('express');
const dbConnection = require('./dbconnection');
const bcrypt = require('bcrypt');
const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username?.trim() || !password?.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Username and password are required',
    });
  }

  const db = dbConnection();

  // Query to find user by username
  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }

    if (results.length === 0) {
      console.log('User not found:', username); // Debugging log
      return res.status(400).json({
        success: false,
        message: 'Invalid username or password',
      });
    }

    const user = results[0];

    // Log retrieved user data for debugging (Do NOT log sensitive data in production)
    console.log('User retrieved from database:', user);

    // Compare the entered password with the stored hashed password
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error('Error comparing passwords:', err);
        return res.status(500).json({
          success: false,
          message: 'Internal server error',
        });
      }

      console.log('Password match result:', isMatch); // Debugging log

      if (!isMatch) {
        // Password does not match
        return res.status(400).json({
          success: false,
          message: 'Invalid username or password',
        });
      }

      // Login successful
      return res.status(200).json({
        success: true,
        message: 'Login successful',
      });
    });
  });
});

module.exports = router;

