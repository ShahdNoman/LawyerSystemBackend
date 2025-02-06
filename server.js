// require('dotenv').config();  // Make sure this is at the very top of your entry file
// const express = require('express');
// const cors = require('cors');
// const path = require('path');
// const app = express();
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// const PORT = 4000;
// app.use(cors({
//   origin: '*', // السماح لجميع المصادر (يمكنك تقييدها إذا كنت تعرف المصدر المحدد)
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // السماح بجميع الطرق
//   allowedHeaders: ['Content-Type', 'Authorization'], // السماح بالرؤوس المطلوبة
// }));

// app.use(express.json());
// const loginRouter = require('./login');
// const signupRouter = require('./insert_record');
// const home = require('./home');
// const search =require('./search');
// const calender =require('./calender');
// const cases = require('./cases');
// const sessions=require('./sessions');
// const adminRouter = require('./adminController');
// const payment=require('./payment');
// const jwt = require('jsonwebtoken');
// const verifyToken = require('./verifyToken');
// const authenticateToken = (req, res, next) => {
//   const token = req.header('Authorization')?.split(' ')[1]; // Split "Bearer <token>"
  
//   if (!token) {
//     return res.status(401).json({
//       success: false,
//       message: 'Access denied. No token provided.',
//     });
//   }

//   jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
//     if (err) {
//       return res.status(403).json({
//         success: false,
//         message: 'Invalid or expired token.',
//       });
//     }
//     req.user = user; // Attach decoded token data to the request
//     next();
//   });
// };
// app.use('/home', home);
// app.use('/search', search);
// app.use('/calender', calender);
// app.use('/login', loginRouter);
// app.use('/insert_record', signupRouter);
// app.use('/cases', cases);
// app.use('/sessions',sessions);
// app.use('/payment',payment);
// app.use('/adminRoutes', authenticateToken, adminRouter); // Protect admin routes
// app.get('/', (req, res) => {
//   res.send('Node.js server is running!');
// });
// app.get('/protected-route', verifyToken, (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: 'Access granted',
//     user: req.user, // Information from the decoded JWT token
//   });
// });
// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error('Error:', err.stack);
//   res.status(500).json({ success: false, message: 'Internal server error' });
// });
// app.listen(PORT, '0.0.0.0', () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const app = express();
const server = http.createServer(app); // Create http server
const socketHandler = require('./socket'); // Import socket handler
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

const loginRouter = require('./login');
const signupRouter = require('./insert_record');
const home = require('./home');
const search = require('./search');
const calender = require('./calender');
const cases = require('./cases');
const sessions = require('./sessions');
const adminRouter = require('./adminController');
const payment = require('./payment');
const jwt = require('jsonwebtoken');
const verifyToken = require('./verifyToken');

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

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
    req.user = user;
    next();
  });
};
app.use('/home', home);
app.use('/search', search);
app.use('/calender', calender);
app.use('/login', loginRouter);
app.use('/insert_record', signupRouter);
app.use('/cases', cases);
app.use('/sessions', sessions);
app.use('/payment', payment);
app.use('/adminRoutes', authenticateToken, adminRouter);

app.get('/', (req, res) => {
  res.send('Node.js server is running!');
});
app.get('/protected-route', verifyToken, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Access granted',
    user: req.user,
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

socketHandler(server); // Initialize socket with http server

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});