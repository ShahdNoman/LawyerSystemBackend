const express = require('express');
const dbConnection = require('./dbconnection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 
require('dotenv').config(); 
const router = express.Router();

// router.post('/login', (req, res) => {
//   const { username, password } = req.body;

//   if (!username?.trim() || !password?.trim()) {
//     return res.status(400).json({
//       success: false,
//       message: 'Username and password are required',
//     });
//   }

//   const db = dbConnection();

//   const query = 'SELECT * FROM users WHERE username = ?';
//   db.query(query, [username], (err, results) => {
//     if (err) {
//       console.error('Database error:', err);
//       return res.status(500).json({
//         success: false,
//         message: 'Internal server error',
//       });
//     }

//     if (results.length === 0) {
//       console.log('User not found:', username); 
//       return res.status(400).json({
//         success: false,
//         message: 'Invalid username or password',
//       });
//     }

//     const user = results[0];

//     console.log('User retrieved from database:', user);

//     bcrypt.compare(password, user.password, (err, isMatch) => {
//       if (err) {
//         console.error('Error comparing passwords:', err);
//         return res.status(500).json({
//           success: false,
//           message: 'Internal server error',
//         });
//       }

//       console.log('Password match result:', isMatch); 

//       if (!isMatch) {
//         return res.status(400).json({
//           success: false,
//           message: 'Invalid username or password',
//         });
//       }

//       const SECRET_KEY = process.env.SECRET_KEY; 
//       const token = jwt.sign(
//         { id: user.user_id, username: user.username }, 
//         SECRET_KEY, 
//         { expiresIn: '1m' } 
//       );

//       return res.status(200).json({
//         success: true,
//         message: 'Login successful',
//         token: token  
//       });
//     });
//   });
// });

// module.exports = router;
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
      console.log('JWT secret key:', SECRET_KEY);

      const token = jwt.sign(
        { id: user.id, username: user.username },
        SECRET_KEY,
        { expiresIn: '1h' }
      );

      console.log('Generated JWT:', token);

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
      });
    });
  });
});
module.exports = router;