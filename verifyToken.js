const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables

const verifyToken = (req, res, next) => {
  // Extract the token from the Authorization header
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.',
    });
  }

  // Verify the token using the secret key
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token.',
      });
    }

    req.user = decoded; // Attach the decoded token to the req object
    next(); // Proceed to the next middleware/route handler
  });
};

module.exports = verifyToken;
