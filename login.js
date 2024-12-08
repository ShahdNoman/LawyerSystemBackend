require('dotenv').config(); 
const express = require('express');
const dbConnection = require('./dbconnection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 
const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  console.log('Login request received:', { username, password });

  if (!username?.trim() || !password?.trim()) {
    console.log('Missing username or password');
    return res.status(400).json({
      success: false,
      message: 'Username and password are required',
    });
  }

  const db = dbConnection();

  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }

    console.log('Database query results:', results);

    if (results.length === 0) {
      console.log('User not found for username:', username);
      return res.status(400).json({
        success: false,
        message: 'Invalid username or password',
      });
    }

    const user = results[0];
    console.log('User retrieved:', user);

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error('Error comparing passwords:', err);
        return res.status(500).json({
          success: false,
          message: 'Internal server error',
        });
      }

      console.log('Password match status:', isMatch);

      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Invalid username or password',
        });
      }

      const SECRET_KEY = process.env.SECRET_KEY;
if (!SECRET_KEY) {
  console.error('SECRET_KEY is missing in environment variables');
  return res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
}
      console.log('JWT secret key in Login:', SECRET_KEY);
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role }, 
    SECRET_KEY, // Ensure SECRET_KEY is in .env
    { expiresIn: '1h' } // Token expires in 1 hour
  );

  console.log('Generated JWT in Login:', token);
  return res.status(200).json({
    success: true,
    message: 'Login successful',
    token,
    role: user.role, 
  });
    });
  });
});
module.exports = router;
