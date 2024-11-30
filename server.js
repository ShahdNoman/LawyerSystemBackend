// const express = require('express');
// const cors = require('cors');  
// const app = express();
// const PORT = 500;
// app.use(cors());  // Enable CORS for all routes
// app.use(express.json());  // Middleware to parse JSON data

// // Example route: Test the server
// app.get('/', (req, res) => {
//     res.send('Node.js server is running!');
// });

// // Your /login route (add this if needed for your project)
// app.post('/login', (req, res) => {
//     const { username, password } = req.body;
//     // Add logic to handle login (e.g., check username/password)
//     if (username === 'Shahd' && password === '123') {
//         return res.json({ success: true });
//     } else {
//         return res.json({ success: false, message: 'Invalid credentials' });
//     }
// });

// // Start the server
// app.listen(PORT, '0.0.0.0', () => {
//     console.log(`Server is running on http://0.0.0.0:${PORT}`);
// });


// const express = require('express');
// const cors = require('cors');  
// const insertRecordRouter = require('./insert_record');  // Import the insert_record route

// const app = express();
// const PORT = 500;

// app.use(cors());  // Enable CORS for all routes
// app.use(express.json());  // Middleware to parse JSON data

// // Example route: Test the server
// app.get('/', (req, res) => {
//     res.send('Node.js server is running!');
// });

// // Use the imported route for /insert_record
// app.use(insertRecordRouter);  // This will now handle the /insert_record route

// // Your /login route (add this if needed for your project)
// app.post('/login', (req, res) => {
//     const { username, password } = req.body;
//     if (username === 'Shahd' && password === '123') {
//         return res.json({ success: true });
//     } else {
//         return res.json({ success: false, message: 'Invalid credentials' });
//     }
// });

// // Start the server
// app.listen(PORT, '0.0.0.0', () => {
//     console.log(`Server is running on http://0.0.0.0:${PORT}`);
// });
const express = require('express');
const cors = require('cors');
const loginRouter = require('./login');
const signupRouter = require('./insert_record');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Built-in JSON parser

// Debugging middleware to log requests
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  if (req.body) {
    console.log('Request body:', req.body);
  }
  next();
});

// Test route
app.get('/', (req, res) => {
  res.send('Node.js server is running!');
});

// Register routes
app.use('/login', loginRouter);
app.use('/insert_record', signupRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// const express = require('express');
// const cors = require('cors');
// const loginRouter = require('./login');
// const signupRouter = require('./insert_record');
// const dbConnection = require('./dbconnection'); // Ensure this is correctly set up
// const bodyParser = require('body-parser');  // Ensure this is correctly required

// const app = express();
// const PORT = 3000;

// app.use(bodyParser.json()); // Parse incoming JSON requests
// // Register routes
// app.use('/login', loginRouter);
// app.use('/insert_record', signupRouter);

// app.use(cors());
// app.use(express.json());

// // Test route
// app.get('/', (req, res) => {
//   res.send('Node.js server is running!');
// });


// // Start the server
// app.listen(PORT, '0.0.0.0', () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
