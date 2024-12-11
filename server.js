require('dotenv').config();  // Make sure this is at the very top of your entry file
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
app.use('/uploads', (req, res, next) => {
  console.log(`Requesting: ${req.originalUrl}`);
  next();
}, express.static(path.join(__dirname, 'uploads')));
const PORT = 4000;
app.use(cors());
app.use(express.json());
const loginRouter = require('./login');
const signupRouter = require('./insert_record');
const adminRouter = require('./adminController');
const jwt = require('jsonwebtoken');
const verifyToken = require('./verifyToken');
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Split "Bearer <token>"
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.',
    });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token.',
      });
    }
    req.user = user; // Attach decoded token data to the request
    next();
  });
};

app.use('/login', loginRouter);
app.use('/insert_record', signupRouter);
app.use('/adminRoutes', authenticateToken, adminRouter); // Protect admin routes
app.get('/', (req, res) => {
  res.send('Node.js server is running!');
});
app.get('/protected-route', verifyToken, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Access granted',
    user: req.user, // Information from the decoded JWT token
  });
});
// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

