const jwt = require('jsonwebtoken');

const sendError = (res, message) => {
  return res.status(403).json({ message });
};

const isAdmin = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return sendError(res, 'Access Denied, Token Missing');
  }

  const tokenWithoutBearer = token.startsWith('Bearer ') ? token.slice(7) : token;

  jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return sendError(res, 'Invalid Token');
    }

    if (decoded.role !== 'Admin') {
      return sendError(res, 'You do not have permission to access this resource');
    }

    next(); // Proceed to the next middleware/route handler
  });
};

module.exports = isAdmin;
