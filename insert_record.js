
const express = require('express');
const dbConnection = require('./dbconnection');
const bcrypt = require('bcrypt');
const router = express.Router();

// Password validation function
function isPasswordStrong(password) {
  const minLength = 8;
  const regex = {
    uppercase: /[A-Z]/,
    lowercase: /[a-z]/,
    number: /\d/,
    specialChar: /[!@#$%^&*(),.?":{}|<>]/,
  };

  const errors = [];

  // Check length
  if (password.length < minLength) errors.push('Password must be at least 8 characters long.');
  if (!regex.uppercase.test(password)) errors.push('Password must contain at least one uppercase letter.');
  if (!regex.lowercase.test(password)) errors.push('Password must contain at least one lowercase letter.');
  if (!regex.number.test(password)) errors.push('Password must contain at least one number.');
  if (!regex.specialChar.test(password)) errors.push('Password must contain at least one special character.');

  return errors;
}

// User registration route
router.post('/insert_record', (req, res) => {
  const { username, password, email } = req.body;

  // Check if all fields are provided
  if (!username?.trim() || !password?.trim() || !email?.trim()) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required',
    });
  }

  // Validate password strength
  const passwordErrors = isPasswordStrong(password);
  if (passwordErrors.length > 0) {
    return res.status(400).json({
      success: false,
      message: passwordErrors.join(' '), // Join all error messages into a single string
    });
  }

  const db = dbConnection();

  // Check if the user already exists
  const checkUserQuery = 'SELECT * FROM users WHERE username = ?';
  db.query(checkUserQuery, [username], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }

    if (results.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    // Hash the password before inserting
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error('Error hashing password:', err);
        return res.status(500).json({
          success: false,
          message: 'Internal server error',
        });
      }

      // Insert the new user into the database with hashed password
      const insertQuery = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
      db.query(insertQuery, [username, hashedPassword, email], (err) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({
            success: false,
            message: 'Internal server error',
          });
        }

        return res.status(201).json({
          success: true,
          message: 'User registered successfully',
        });
      });
    });
  });
});

// Export the router to use in other files
module.exports = router;
