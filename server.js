// const express = require('express');
// const cors = require('cors');
// const loginRouter = require('./login');
// const signupRouter = require('./insert_record');

// const app = express();
// const PORT = 4000;
// app.use(cors());
// app.use(express.json()); 

// app.use((req, res, next) => {
//   console.log(`Incoming request: ${req.method} ${req.url}`);
//   if (req.body) {
//     console.log('Request body:', req.body);
//   }
//   next();
// });

// app.get('/', (req, res) => {
//   res.send('Node.js server is running!');
// });

// app.use('/login', loginRouter);
// app.use('/insert_record', signupRouter);

// app.use((err, req, res, next) => {
//   console.error('Error:', err.stack);
//   res.status(500).json({ success: false, message: 'Internal server error' });
// });

// app.listen(PORT, '0.0.0.0', () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
const express = require('express');
const cors = require('cors');
const loginRouter = require('./login');
const signupRouter = require('./insert_record');
const jwt = require('jsonwebtoken'); // Import JWT
require('dotenv').config();

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json()); 

// Middleware to validate JWT tokens
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Get token from Authorization header

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded; // Store the decoded user data in the request object
    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.',
    });
  }
};

// Apply the login and signup routers
app.use('/login', loginRouter);
app.use('/insert_record', signupRouter);

// Define a protected route
app.get('/protected-endpoint', authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: 'You have access to this protected endpoint.',
    user: req.user, 
  });
});

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Node.js server is running!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
