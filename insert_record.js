// // const express = require('express');
// // const dbConnection = require('./dbconnection');
// // const bcrypt = require('bcrypt');
// // const jwt = require('jsonwebtoken');
// // require('dotenv').config(); 
// // const router = express.Router();

// // function isPasswordStrong(password) {
// //   const minLength = 8;
// //   const regex = {
// //     uppercase: /[A-Z]/,
// //     lowercase: /[a-z]/,
// //     number: /\d/,
// //     specialChar: /[!@#$%^&*(),.?":{}|<>]/,
// //   };

// //   const errors = [];

// //   if (password.length < minLength) errors.push('Password must be at least 8 characters long.');
// //   if (!regex.uppercase.test(password)) errors.push('Password must contain at least one uppercase letter.');
// //   if (!regex.lowercase.test(password)) errors.push('Password must contain at least one lowercase letter.');
// //   if (!regex.number.test(password)) errors.push('Password must contain at least one number.');
// //   if (!regex.specialChar.test(password)) errors.push('Password must contain at least one special character.');

// //   return errors;
// // }

// // router.post('/insert_record', (req, res) => {
// //   const { username, password, email } = req.body;

// //   if (!username?.trim() || !password?.trim() || !email?.trim()) {
// //     return res.status(400).json({
// //       success: false,
// //       message: 'All fields are required',
// //     });
// //   }
// //   const passwordErrors = isPasswordStrong(password);
// //   if (passwordErrors.length > 0) {
// //     return res.status(400).json({
// //       success: false,
// //       message: passwordErrors.join(' '),
// //     });
// //   }

// //   const db = dbConnection();

// //   const checkUserQuery = 'SELECT * FROM users WHERE username = ?';
// //   db.query(checkUserQuery, [username], (err, results) => {
// //     if (err) {
// //       console.error('Database error:', err);
// //       return res.status(500).json({
// //         success: false,
// //         message: 'Internal server error',
// //       });
// //     }

// //     if (results.length > 0) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'User already exists',
// //       });
// //     }

// //     bcrypt.hash(password, 10, (err, hashedPassword) => {
// //       if (err) {
// //         console.error('Error hashing password:', err);
// //         return res.status(500).json({
// //           success: false,
// //           message: 'Internal server error',
// //         });
// //       }

// //       const insertQuery = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
// //       db.query(insertQuery, [username, hashedPassword, email], (err, result) => {
// //         if (err) {
// //           console.error('Database error:', err);
// //           return res.status(500).json({
// //             success: false,
// //             message: 'Internal server error',
// //           });
// //         }

// //        const token = jwt.sign(
// //           { id: result.insertId, username },
// //           process.env.SECRET_KEY,
// //           { expiresIn: '1m' }
// //         );

// //         return res.status(201).json({
// //           success: true,
// //           message: 'User registered successfully',
// //           token,
// //         });
// //       });
// //     });
// //   });
// // });

// // module.exports = router;
// const express = require('express');
// const dbConnection = require('./dbconnection');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// require('dotenv').config();
// const router = express.Router();

// function isPasswordStrong(password) {
//   const minLength = 8;
//   const regex = {
//     uppercase: /[A-Z]/,
//     lowercase: /[a-z]/,
//     number: /\d/,
//     specialChar: /[!@#$%^&*(),.?":{}|<>]/,
//   };

//   const errors = [];

//   if (password.length < minLength) errors.push('Password must be at least 8 characters long.');
//   if (!regex.uppercase.test(password)) errors.push('Password must contain at least one uppercase letter.');
//   if (!regex.lowercase.test(password)) errors.push('Password must contain at least one lowercase letter.');
//   if (!regex.number.test(password)) errors.push('Password must contain at least one number.');
//   if (!regex.specialChar.test(password)) errors.push('Password must contain at least one special character.');

//   return errors;
// }

// router.post('/insert_record', (req, res) => {
//   const { username, password, email, fullName, phoneNumber, role, bio } = req.body;

//   // Check if all required fields are provided
//   if (!username?.trim() || !password?.trim() || !email?.trim() || !fullName?.trim() || !phoneNumber?.trim() || !role?.trim()) {
//     return res.status(400).json({
//       success: false,
//       message: 'All fields are required',
//     });
//   }

//   // Validate the password strength
//   const passwordErrors = isPasswordStrong(password);
//   if (passwordErrors.length > 0) {
//     return res.status(400).json({
//       success: false,
//       message: passwordErrors.join(' '),
//     });
//   }

//   const db = dbConnection();

//   // Check if user already exists
//   const checkUserQuery = 'SELECT * FROM users WHERE username = ?';
//   db.query(checkUserQuery, [username], (err, results) => {
//     if (err) {
//       console.error('Database error:', err);
//       return res.status(500).json({
//         success: false,
//         message: 'Internal server error',
//       });
//     }

//     if (results.length > 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'User already exists',
//       });
//     }

//     bcrypt.hash(password, 10, (err, hashedPassword) => {
//       if (err) {
//         console.error('Error hashing password:', err);
//         return res.status(500).json({
//           success: false,
//           message: 'Internal server error',
//         });
//       }

//       const insertQuery = 'INSERT INTO users (username, password, email, fullName, phoneNumber, role, bio, membershipNumber, judgeNumber, idNumber) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
//       db.query(insertQuery, [username, hashedPassword, email, fullName, phoneNumber, role, bio], (err, result) => {
//         if (err) {
//           console.error('Database error:', err);
//           return res.status(500).json({
//             success: false,
//             message: 'Internal server error',
//           });
//         }

//         // Generate a token for the new user
//         const token = jwt.sign(
//           { id: result.insertId, username },
//           process.env.SECRET_KEY,
//           { expiresIn: '1m' }
//         );

//         // Return success response
//         return res.status(201).json({
//           success: true,
//           message: 'User registered successfully',
//           token,
//         });
//       });
//     });
//   });
// });

// module.exports = router;
const express = require('express');
const dbConnection = require('./dbconnection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const router = express.Router();

function isPasswordStrong(password) {
  const minLength = 8;
  const regex = {
    uppercase: /[A-Z]/,
    lowercase: /[a-z]/,
    number: /\d/,
    specialChar: /[!@#$%^&*(),.?":{}|<>]/,
  };

  const errors = [];

  if (password.length < minLength) errors.push('Password must be at least 8 characters long.');
  if (!regex.uppercase.test(password)) errors.push('Password must contain at least one uppercase letter.');
  if (!regex.lowercase.test(password)) errors.push('Password must contain at least one lowercase letter.');
  if (!regex.number.test(password)) errors.push('Password must contain at least one number.');
  if (!regex.specialChar.test(password)) errors.push('Password must contain at least one special character.');

  return errors;
}

router.post('/insert_record', (req, res) => {
  const { 
    username, 
    password, 
    email, 
    full_name, 
    phone_number, 
    role, 
    bio, 
    membership_number, 
    judge_number, 
    id_number 
  } = req.body;

  if (!username?.trim() || !password?.trim() || !email?.trim()) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required',
    });
  }

  const passwordErrors = isPasswordStrong(password);
  if (passwordErrors.length > 0) {
    return res.status(400).json({
      success: false,
      message: passwordErrors.join(' '),
    });
  }

  const db = dbConnection();

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

    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error('Error hashing password:', err);
        return res.status(500).json({
          success: false,
          message: 'Internal server error',
        });
      }

      const insertQuery = `
        INSERT INTO users (
          username,
          password,
          email,
          full_name,
          phone_number,
          role,
          bio,
          membership_number,
          judge_number,
          id_number
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      db.query(insertQuery, [
        username,
        hashedPassword,
        email,
        full_name,
        phone_number,
        role,
        bio,
        membership_number,
        judge_number,
        id_number
      ], (err, result) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({
            success: false,
            message: 'Internal server error',
          });
        }

        const token = jwt.sign(
          { id: result.insertId, username },
          process.env.SECRET_KEY,
          { expiresIn: '1m' }
        );

        return res.status(201).json({
          success: true,
          message: 'User registered successfully',
          token,
        });
      });
    });
  });
});

module.exports = router;
