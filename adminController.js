// const bcrypt = require('bcrypt'); // Use bcrypt instead of bcryptjs
// const express = require('express');
// const dbConnection = require('./dbconnection');
// const verifyToken = require('./verifyToken'); 
// const path = require('path');
// const app = express();  // Initialize app
// app.use('/uploads', (req, res, next) => {
//   console.log(`Requesting: ${req.originalUrl}`);
//   next();
// }, express.static(path.join(__dirname, 'uploads')));

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



// ////////////////////////////////

// router.get('/viewAll-attachments', verifyToken, async (req, res) => {
//   try {
//     const query = 'SELECT * FROM attachments';
//     console.log('Executing query:', query);  
//     const [result] = await dbConnection().promise().query(query);
//         if (!result || result.length === 0) {
//       return res.status(404).json({ message: 'No attachments found' });
//     }

//     res.json(result);
//   } catch (error) {
//     console.error('Error fetching attachments:', error);
//     res.status(500).json({ message: 'Error fetching attachments', error: error.message || error });
//   }
// });
// router.get('/viewAll-conversations', verifyToken, async (req, res) => {
//   try {
//     const query = 'SELECT * FROM conversations';
//     console.log('Executing query:', query);  
//     const [result] = await dbConnection().promise().query(query);
//         if (!result || result.length === 0) {
//       return res.status(404).json({ message: 'No conversations found' });
//     }

//     res.json(result);
//   } catch (error) {
//     console.error('Error fetching conversations:', error);
//     res.status(500).json({ message: 'Error fetching conversations', error: error.message || error });
//   }
// });
// router.get('/viewAll-notifications', verifyToken, async (req, res) => {
//   try {
//     const userId = req.user.id; // Modify based on how user_id is passed
//     const query = 'SELECT * FROM notifications WHERE user_id = ?';
//     console.log('Executing query:', query);

//     const [result] = await dbConnection().promise().query(query, [userId]);

//     if (!result || result.length === 0) {
//       return res.status(404).json({ message: 'No notifications found' });
//     }

//     res.json(result);
//   } catch (error) {
//     console.error('Error fetching notifications:', error);
//     res.status(500).json({ message: 'Error fetching notifications', error: error.message || error });
//   }
// });


// router.get('/viewAll-payments', verifyToken, async (req, res) => {
//   try {
//     const query = 'SELECT * FROM payments';
//     console.log('Executing query:', query);  
//     const [result] = await dbConnection().promise().query(query);
//         if (!result || result.length === 0) {
//       return res.status(404).json({ message: 'No payments found' });
//     }

//     res.json(result);
//   } catch (error) {
//     console.error('Error fetching payments:', error);
//     res.status(500).json({ message: 'Error fetching payments', error: error.message || error });
//   }
// });

// router.get('/viewAll-sessions', verifyToken, async (req, res) => {
//   try {
//     const query = 'SELECT * FROM sessions';
//     console.log('Executing query:', query);  
//     const [result] = await dbConnection().promise().query(query);
//         if (!result || result.length === 0) {
//       return res.status(404).json({ message: 'No sessions found' });
//     }

//     res.json(result);
//   } catch (error) {
//     console.error('Error fetching sessions:', error);
//     res.status(500).json({ message: 'Error fetching sessions', error: error.message || error });
//   }
// });


// router.get('/viewAll-complaints', verifyToken, async (req, res) => {
//   try {
//     const query = 'SELECT * FROM complaints';
//     console.log('Executing query:', query);  
//     const [result] = await dbConnection().promise().query(query);
//         if (!result || result.length === 0) {
//       return res.status(404).json({ message: 'No complaints found' });
//     }

//     res.json(result);
//   } catch (error) {
//     console.error('Error fetching complaints:', error);
//     res.status(500).json({ message: 'Error fetching complaints', error: error.message || error });
//   }
// });


// router.get('/viewAll-cases', verifyToken, async (req, res) => {
//   try {
//     const query = 'SELECT * FROM cases';
//     console.log('Executing query:', query);  
//     const [result] = await dbConnection().promise().query(query);
//         if (!result || result.length === 0) {
//       return res.status(404).json({ message: 'No cases found' });
//     }

//     res.json(result);
//   } catch (error) {
//     console.error('Error fetching cases:', error);
//     res.status(500).json({ message: 'Error fetching cases', error: error.message || error });
//   }
// });
// router.get('/viewAll-users', verifyToken, async (req, res) => {
//   try {
//     const query = 'SELECT * FROM users';
//     console.log('Executing query:', query);  
//     const [result] = await dbConnection().promise().query(query);
//         if (!result || result.length === 0) {
//       return res.status(404).json({ message: 'No users found' });
//     }

//     res.json(result);
//   } catch (error) {
//     console.error('Error fetching users:', error);
//     res.status(500).json({ message: 'Error fetching users', error: error.message || error });
//   }
// });


// ///////

// router.post('/create-admin', verifyToken, async (req, res) => {
//   const { username, password, email, phone_number, full_name, status } = req.body;

//   // Check for missing required fields
//   if (!username || !password || !email || !phone_number || !full_name) {
//     return res.status(400).json({ message: 'Missing required fields' });
//   }

//   // Default value for status if not provided
//   const userStatus = status || 'Active';

//   try {
//     // Insert query to add the user
//     const query = `
//       INSERT INTO users (username, password, role, email, phone_number, full_name, status)
//       VALUES (?, ?, 'Admin', ?, ?, ?, ?)
//     `;

//     // Execute the query
//     const [result] = await dbConnection().promise().query(query, [username, password, email, phone_number, full_name, userStatus]);

//     res.status(201).json({ message: 'Admin user created successfully', userId: result.insertId });
//   } catch (error) {
//     console.error('Error creating admin user:', error);
//     res.status(500).json({ message: 'Error creating admin user', error: error.message || error });
//   }
// });




// router.post('/get-my-info', verifyToken, async (req, res) => {
//   try {
//     const user_id = req.user.id; // User ID is passed from the verifyToken middleware

//     if (!user_id) {
//       return res.status(400).json({ message: 'User ID is required' });
//     }

//     // Query to retrieve user information including hashed password and profile picture
//     const userQuery = `
//       SELECT id, username, email, full_name, phone_number, password, bio, profile_picture
//       FROM users
//       WHERE id = ?
//     `;

//     const [userResult] = await dbConnection().promise().query(userQuery, [user_id]);

//     if (userResult.length === 0) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//     const userData = userResult[0]; // Assuming only one user is returned
//     // Do not include the password in the response
//     res.status(200).json({
//       message: 'User information retrieved successfully',
//       user: {
//         id: userData.id,
//         username: userData.username,
//         email: userData.email,
//         fullName: userData.full_name,
//         phoneNumber: userData.phone_number,
//         bio: userData.bio,
//         profilePic: userData.profile_picture,  // Assuming 'profile_pic' is the path or URL to the profile image
//       }
//     });
//   } catch (error) {
//     console.error('Error retrieving user:', error);
//     res.status(500).json({ message: 'Error retrieving user information', error: error.message || error });
//   }
// });
// router.post('/get-payments', verifyToken, async (req, res) => {
//   try {
//     const { case_id } = req.body; // Assuming you're passing case_id in the request body

//     if (!case_id) {
//       return res.status(400).json({ message: 'Case ID is required' });
//     }

//     // Query to retrieve payments related to the case_id
//     const paymentQuery = `
//       SELECT id, case_id, amount, payment_date, payment_status
//       FROM payments
//       WHERE case_id = ?
//     `;

//     const [paymentResults] = await dbConnection().promise().query(paymentQuery, [case_id]);

//     if (paymentResults.length === 0) {
//       return res.status(404).json({ message: 'No payments found for this case' });
//     }

//     const paymentsData = paymentResults.map(payment => ({
//       id: payment.id,
//       amount: payment.amount,
//       paymentDate: payment.payment_date,
//       paymentStatus: payment.payment_status
//     }));
//     console.log(paymentResults); // Log the payment data to check if payment_date is present
//     res.status(200).json({
//       message: 'Payments retrieved successfully',
//       payments: paymentsData
//     });
//   } catch (error) {
//     console.error('Error retrieving payments:', error);
//     res.status(500).json({ message: 'Error retrieving payments', error: error.message || error });
//   }
// });
// router.post('/get-sessions', verifyToken, async (req, res) => {
//   try {
//     const { case_id } = req.body; // Assuming you're passing case_id in the request body

//     if (!case_id) {
//       return res.status(400).json({ message: 'Case ID is required' });
//     }

//     // Query to retrieve sessions related to the case_id
//     const sessionQuery = `
//       SELECT id, case_id, session_date, session_details, session_status
//       FROM sessions
//       WHERE case_id = ? AND case_id != 9
//     `;

//     const [sessionResults] = await dbConnection().promise().query(sessionQuery, [case_id]);

//     if (sessionResults.length === 0) {
//       return res.status(404).json({ message: 'No sessions found for this case' });
//     }

//     const sessionsData = sessionResults.map(session => ({
//       id: session.id,
//       sessionDate: session.session_date,
//       sessionDetails: session.session_details,
//       sessionStatus: session.session_status
//     }));

//     console.log(sessionResults); // Log the session data for debugging
//     res.status(200).json({
//       message: 'Sessions retrieved successfully',
//       sessions: sessionsData
//     });
//   } catch (error) {
//     console.error('Error retrieving sessions:', error);
//     res.status(500).json({ message: 'Error retrieving sessions', error: error.message || error });
//   }
// });

// router.post('/get-attachment', verifyToken, async (req, res) => {
//   try {
//     const { case_id } = req.body; // Assuming you're passing case_id in the request body

//     if (!case_id) {
//       return res.status(400).json({ message: 'Case ID is required' });
//     }

//     // Query to retrieve attachments related to the case_id
//     const attachmentQuery = `
//       SELECT id, case_id, file_path, file_type, uploaded_by_user_id, upload_time
//       FROM attachments
//       WHERE case_id = ?
//     `;

//     const [attachmentResults] = await dbConnection().promise().query(attachmentQuery, [case_id]);

//     if (attachmentResults.length === 0) {
//       return res.status(404).json({ message: 'No attachments found for this case' });
//     }

//     const attachmentsData = attachmentResults.map(attachment => ({
//       id: attachment.id,
//       filePath: attachment.file_path,
//       fileType: attachment.file_type,
//       uploadedByUserId: attachment.uploaded_by_user_id,
//       uploadTime: attachment.upload_time
//     }));

//     console.log(attachmentResults); // Log the attachment data for debugging
//     res.status(200).json({
//       message: 'Attachments retrieved successfully',
//       attachments: attachmentsData
//     });
//   } catch (error) {
//     console.error('Error retrieving attachments:', error);
//     res.status(500).json({ message: 'Error retrieving attachments', error: error.message || error });
//   }
// });
// router.post('/get-complaint', verifyToken, async (req, res) => {
//   try {
//     const { case_id } = req.body; // Assuming you're passing case_id in the request body

//     if (!case_id) {
//       return res.status(400).json({ message: 'Case ID is required' });
//     }

//     // Query to retrieve complaints related to the case_id
//     const complaintQuery = `
//       SELECT id, case_id, complaint_type, complaint_details, complainant_id, accused_id, complaint_status, creation_date
//       FROM complaints
//       WHERE case_id = ?
//     `;

//     const [complaintResults] = await dbConnection().promise().query(complaintQuery, [case_id]);

//     if (complaintResults.length === 0) {
//       return res.status(404).json({ message: 'No complaints found for this case' });
//     }

//     const complaintsData = complaintResults.map(complaint => ({
//       id: complaint.id,
//       caseId: complaint.case_id,
//       complaintType: complaint.complaint_type,
//       complaintDetails: complaint.complaint_details,
//       complainantId: complaint.complainant_id,
//       accusedId: complaint.accused_id,
//       complaintStatus: complaint.complaint_status,
//       creationDate: complaint.creation_date
//     }));

//     console.log(complaintResults); // Log the complaint data for debugging
//     res.status(200).json({
//       message: 'Complaints retrieved successfully',
//       complaints: complaintsData
//     });
//   } catch (error) {
//     console.error('Error retrieving complaints:', error);
//     res.status(500).json({ message: 'Error retrieving complaints', error: error.message || error });
//   }
// });

// router.post('/get-user-info', verifyToken, async (req, res) => {
//   try {
//     const { user_id } = req.body; // Assuming you're passing the user_id in the request body

//     if (!user_id) {
//       return res.status(400).json({ message: 'User ID is required' });
//     }

//     // Query to retrieve user information including pic
//     const userQuery = `
//       SELECT id, username, email, full_name, phone_number, bio, profile_picture
//       FROM users
//       WHERE id = ?
//     `;

//     const [userResult] = await dbConnection().promise().query(userQuery, [user_id]);

//     if (userResult.length === 0) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const userData = userResult[0]; // Assuming only one user is returned

//     res.status(200).json({
//       message: 'User information retrieved successfully',
//       user: {
//         id: userData.id,
//         username: userData.username,
//         email: userData.email,
//         fullName: userData.full_name,
//         phoneNumber: userData.phone_number,
//         bio: userData.bio,
//         profilePic: userData.profile_picture,  // Assuming 'profile_pic' is the path or URL to the profile image
//       }
//     });
//   } catch (error) {
//     console.error('Error retrieving user:', error);
//     res.status(500).json({ message: 'Error retrieving user information', error: error.message || error });
//   }
// });




// router.post('/create-notification', verifyToken, async (req, res) => {
//   try {
//     const { user_id, notification_type, message } = req.body;
//     if (!user_id || !notification_type || !message) {
//       return res.status(400).json({ message: 'Missing required fields' });
//     }

//     const query = `
//       INSERT INTO notifications (user_id, notification_type, message, is_read)
//       VALUES (?, ?, ?, 0)
//     `;
//     const [result] = await dbConnection().promise().query(query, [user_id, notification_type, message]);
//     res.status(201).json({ message: 'Notification created successfully', notificationId: result.insertId });

//   } catch (error) {
//     console.error('Error creating notification:', error);
//     res.status(500).json({ message: 'Error creating notification', error: error.message || error });
//   }
// });




// router.post('/create-conversation', verifyToken, async (req, res) => {
//   try {
//     const { sender_id, receiver_id, content, message_type } = req.body;
//     if (!sender_id || !receiver_id || !content || !message_type) {
//       return res.status(400).json({ message: 'Missing required fields' });
//     }

//     const query = `
//       INSERT INTO conversations (sender_id, receiver_id, content, message_type)
//       VALUES (?, ?, ?, ?)
//     `;

//     const [result] = await dbConnection().promise().query(query, [sender_id, receiver_id, content, message_type]);

//     res.status(201).json({ message: 'Conversation created successfully', conversationId: result.insertId });

//   } catch (error) {
//     console.error('Error creating conversation:', error);
//     res.status(500).json({ message: 'Error creating conversation', error: error.message || error });
//   }
// });

// router.post('/mark-conversation-read', verifyToken, async (req, res) => {
//   try {
//     const { conversation_id } = req.body; 
//     if (!conversation_id) {
//       return res.status(400).json({ message: 'Missing conversation_id' });
//     }
//     const query = `
//       UPDATE conversations
//       SET is_read = 1
//       WHERE id = ?
//     `;

//     const [result] = await dbConnection().promise().query(query, [conversation_id]);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: 'Conversation not found' });
//     }

//     res.status(200).json({ message: 'Conversation marked as read successfully' });

//   } catch (error) {
//     console.error('Error marking conversation as read:', error);
//     res.status(500).json({ message: 'Error marking conversation as read', error: error.message || error });
//   }
// });

// router.post('/markAll-notifications-read', verifyToken, async (req, res) => {
//   try {
//     const userId = req.user.id; // Get user_id from the authenticated token
//     console.log('Marking all notifications as read for user:', userId);

//     const query = 'UPDATE notifications SET is_read = 1 WHERE user_id = ? AND is_read = 0'; // Only mark unread notifications
//     console.log('Executing query:', query);

//     // Execute the query
//     const [result] = await dbConnection().promise().query(query, [userId]);

//     if (result.affectedRows === 0) {
//       console.log(`No unread notifications found for userId: ${userId}`);
//       return res.status(404).json({ message: 'No unread notifications found' });
//     }

//     console.log(`Successfully marked ${result.affectedRows} notifications as read for userId: ${userId}`);
//     res.json({ message: 'All notifications marked as read' });
//   } catch (error) {
//     console.error('Error marking all notifications as read:', error);
//     res.status(500).json({ message: 'Error marking all notifications as read', error: error.message || error });
//   }
// });

// router.put('/mark-notification-read/:notificationId', verifyToken, async (req, res) => {
//   try {
//     const userId = req.user.id; 
//     const notificationId = req.params.notificationId; // Get the notification ID from URL parameters
//     const query = 'UPDATE notifications SET is_read = 1 WHERE user_id = ? AND id = ?';

//     console.log('Executing query:', query);

//     const [result] = await dbConnection().promise().query(query, [userId, notificationId]);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: 'Notification not found or already marked as read' });
//     }

//     res.json({ message: `Notification ${notificationId} marked as read` });
//   } catch (error) {
//     console.error('Error marking notification as read:', error);
//     res.status(500).json({ message: 'Error marking notification as read', error: error.message || error });
//   }
// });



// router.post('/add-case', verifyToken, async (req, res) => {
//   try {
//     const { case_number, case_type, case_status, plaintiff_id, defendant_id, lawyer_id, judge_id, court_name, court_type, session_date, session_status, next_session_date } = req.body;

//     if (!case_number || !case_type || !case_status || !plaintiff_id || !defendant_id || !lawyer_id || !judge_id || !court_name || !court_type || !session_date || !session_status || !next_session_date) {
//       return res.status(400).json({ message: 'Missing required fields' });
//     }

//     const query = `
//       INSERT INTO cases (case_number, case_type, case_status, plaintiff_id, defendant_id, lawyer_id, judge_id, court_name, court_type, session_date, session_status, next_session_date)
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `;

//     const [result] = await dbConnection().promise().query(query, [case_number, case_type, case_status, plaintiff_id, defendant_id, lawyer_id, judge_id, court_name, court_type, session_date, session_status, next_session_date]);

//     res.status(201).json({ message: 'Case created successfully', caseId: result.insertId });
//   } catch (error) {
//     console.error('Error creating case:', error);
//     res.status(500).json({ message: 'Error creating case', error: error.message || error });
//   }
// });
// router.get('/total-users', verifyToken, async (req, res) => {
//   try {
//     const query = 'SELECT COUNT(*) AS total FROM users';
//     console.log('Executing query:', query);  // Log the query for debugging

//     // Execute the query using the promise-based API
//     const [result] = await dbConnection().promise().query(query);
//         if (!result || result.length === 0) {
//       return res.status(404).json({ message: 'No users found' });
//     }

//     res.json(result[0]);
//   } catch (error) {
//     console.error('Error fetching total users:', error);
//     res.status(500).json({ message: 'Error fetching total users', error: error.message || error });
//   }
// });

// router.post('/add-complaint', verifyToken, async (req, res) => {
//   try {
//     const { case_id, complaint_type, complaint_details, complainant_id, accused_id, complaint_status } = req.body;

//     if (!case_id || !complaint_type || !complaint_details || !complainant_id || !accused_id) {
//       return res.status(400).json({ message: 'Missing required fields' });
//     }

//     const query = `
//       INSERT INTO complaints (case_id, complaint_type, complaint_details, complainant_id, accused_id, complaint_status)
//       VALUES (?, ?, ?, ?, ?, ?)
//     `;

//     const [result] = await dbConnection().promise().query(query, [case_id, complaint_type, complaint_details, complainant_id, accused_id, complaint_status]);

//     res.status(201).json({ message: 'Complaint added successfully', complaintId: result.insertId });
//   } catch (error) {
//     console.error('Error adding complaint:', error);
//     res.status(500).json({ message: 'Error adding complaint', error: error.message || error });
//   }
// });
// router.post('/add-attachment', verifyToken, async (req, res) => {
//   try {
//     const { case_id, file_path, file_type, uploaded_by_user_id } = req.body;
//     if (!case_id || !file_path || !file_type || !uploaded_by_user_id) {
//       return res.status(400).json({ message: 'Missing required fields' });
//     }
//     const query = `
//       INSERT INTO attachments (case_id, file_path, file_type, uploaded_by_user_id)
//       VALUES (?, ?, ?, ?)
//     `;

//     const [result] = await dbConnection().promise().query(query, [case_id, file_path, file_type, uploaded_by_user_id]);

//     res.status(201).json({ message: 'Attachment added successfully', attachmentId: result.insertId });
//   } catch (error) {
//     console.error('Error adding attachment:', error);
//     res.status(500).json({ message: 'Error adding attachment', error: error.message || error });
//   }
// });

// router.post('/add-payment', verifyToken, async (req, res) => {
//   try {
//     const { case_id, amount, payment_status } = req.body;
//     if (!case_id || !amount || !payment_status) {
//       return res.status(400).json({ message: 'Missing required fields' });
//     }
//     const query = `
//       INSERT INTO payments (case_id, amount, payment_status)
//       VALUES (?, ?, ?)
//     `;
//     const [result] = await dbConnection().promise().query(query, [case_id, amount, payment_status]);
//     res.status(201).json({ message: 'Payment created successfully', paymentId: result.insertId });

//   } catch (error) {
//     console.error('Error creating payment:', error);
//     res.status(500).json({ message: 'Error creating payment', error: error.message || error });
//   }
// });

// // Route to get the number of active cases
// router.get('/active-cases', verifyToken, async (req, res) => {
//   try {
//     const query = 'SELECT COUNT(*) AS active_cases FROM cases WHERE case_status = "Ongoing"';
//     console.log('Executing query:', query);  // Log the query for debugging

//     const [result] = await dbConnection().promise().query(query);
//     if (!result || result.length === 0) {
//       return res.status(404).json({ message: 'No active cases found' });
//     }

//     res.json(result[0]);
//   } catch (error) {
//     console.error('Error fetching active cases:', error);
//     res.status(500).json({ message: 'Error fetching active cases', error: error.message || error });
//   }
// });

// // Route to get total pending payments
// router.get('/pending-payments', verifyToken, async (req, res) => {
//   try {
//     const query = 'SELECT COUNT(*) AS pending_payments FROM payments WHERE payment_status = "Pending"';
//     console.log('Executing query:', query);  // Log the query for debugging

//     const [result] = await dbConnection().promise().query(query);
//     if (!result || result.length === 0) {
//       return res.status(404).json({ message: 'No pending payments found' });
//     }

//     res.json(result[0]);
//   } catch (error) {
//     console.error('Error fetching pending payments:', error);
//     res.status(500).json({ message: 'Error fetching pending payments', error: error.message || error });
//   }
// });

// // Route to get unread notifications count
// router.get('/unread-notifications', verifyToken, async (req, res) => {
//   try {
//     const query = 'SELECT COUNT(*) AS unread_notifications FROM notifications WHERE is_read = 0';
//     console.log('Executing query:', query);  // Log the query for debugging

//     const [result] = await dbConnection().promise().query(query);
//     if (!result || result.length === 0) {
//       return res.status(404).json({ message: 'No unread notifications found' });
//     }

//     res.json(result[0]);
//   } catch (error) {
//     console.error('Error fetching unread notifications:', error);
//     res.status(500).json({ message: 'Error fetching unread notifications', error: error.message || error });
//   }
// });

// router.delete('/notifications/:id', verifyToken, async (req, res) => {
//   const { id } = req.params.id; 

//   try {
//     const query = 'DELETE FROM notifications WHERE id = ?';
//     console.log('Executing query:', query, 'with ID:', id); // Log query execution for debugging

//     const [result] = await dbConnection().promise().query(query, [id]);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: 'Notification not found or already deleted' });
//     }

//     res.json({ message: 'Notification deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting notification:', error);
//     res.status(500).json({ message: 'Error deleting notification', error: error.message || error });
//   }
// });

// router.post('/create-session', verifyToken, async (req, res) => {
//   try {
//     const { case_id, session_date, session_details, session_status } = req.body;

//     if (!case_id || !session_date || !session_details || !session_status) {
//       return res.status(400).json({ message: 'Missing required fields' });
//     }

//     const query = `
//       INSERT INTO sessions (case_id, session_date, session_details, session_status)
//       VALUES (?, ?, ?, ?)
//     `;

//     const [result] = await dbConnection().promise().query(query, [case_id, session_date, session_details, session_status]);

//     res.status(201).json({ message: 'Session created successfully', sessionId: result.insertId });
//   } catch (error) {
//     console.error('Error creating session:', error);
//     res.status(500).json({ message: 'Error creating session', error: error.message || error });
//   }
// });







// //////   update 
// router.put('/update-user-status/:id', verifyToken, async (req, res) => {
//   const userId = req.params.id;
//   const { status } = req.body;  // Assuming status is passed in the request body

//   if (!status) {
//     return res.status(400).json({ message: 'Status is required' });
//   }

//   try {
//     const query = 'UPDATE users SET status = ? WHERE id = ?';

//     const [result] = await dbConnection().promise().query(query, [status, userId]);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.json({ message: 'User status updated successfully' });
//   } catch (error) {
//     console.error('Error updating user status:', error);
//     res.status(500).json({ message: 'Error updating user status', error: error.message || error });
//   }
// });


// router.post('/update-notification-status', verifyToken, async (req, res) => {
//   try {
//     const { notification_id } = req.body;
//     if (!notification_id) {
//       return res.status(400).json({ message: 'Missing notification ID' });
//     }

//     const query = `
//       UPDATE notifications
//       SET is_read = 1
//       WHERE id = ?
//     `;

//     const [result] = await dbConnection().promise().query(query, [notification_id]);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: 'Notification not found' });
//     }
//     res.status(200).json({ message: 'Notification status updated successfully' });

//   } catch (error) {
//     console.error('Error updating notification status:', error);
//     res.status(500).json({ message: 'Error updating notification status', error: error.message || error });
//   }
// });

// router.put('/update-profile', verifyToken, async (req, res) => {
//   try {
//     // Extracting data from the request body
//     const { username, email, phone_number, full_name, profile_picture, bio } = req.body;
//     console.log({
//       username,
//       email,
//       phone_number,
//       full_name,
//       profile_picture,
//       bio,
//     });
//     // Validate the incoming data
//     if (!username || !email) {
//       return res.status(400).json({ message: 'Username and email are required' });
//     }
//     // Build the query dynamically depending on which fields are provided
//     let query = 'UPDATE users SET ';
//     const values = [];

//     // Conditionally add fields to the query and values array
//     if (username) {
//       query += 'username = ?, ';
//       values.push(username);
//     }
//     if (email) {
//       query += 'email = ?, ';
//       values.push(email);
//     }
//     if (phone_number) {
//       query += 'phone_number = ?, ';
//       values.push(phone_number);
//     }
//     if (full_name) {
//       query += 'full_name = ?, ';
//       values.push(full_name);
//     }
//     if (profile_picture) {
//       query += 'profile_picture = ?, ';
//       values.push(profile_picture);
//     }
//     if (bio) {
//       query += 'bio = ?, ';
//       values.push(bio);
//     }

//     // Remove the last comma and space
//     query = query.slice(0, -2);

//     // Add the WHERE clause to identify the user by their ID (assuming the user ID is in req.user)
//     query += ' WHERE id = ?';
//     values.push(req.user.id); // Assuming `req.user.id` contains the authenticated user's ID

//     // Execute the query
//     const [result] = await dbConnection().promise().query(query, values);

//     // Check if any row was updated
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Respond with success message
//     res.status(200).json({ message: 'Profile updated successfully' });
//   } catch (error) {
//     console.error('Error updating profile:', error);
//     res.status(500).json({ message: 'Error updating profile', error: error.message || error });
//   }
// });

// router.put('/update-case-status', verifyToken, async (req, res) => {
//   try {
//     const { case_id, case_status } = req.body;

//     if (!case_id || !case_status) {
//       return res.status(400).json({ message: 'Missing required fields' });
//     }

//     const query = `
//       UPDATE cases 
//       SET case_status = ? 
//       WHERE id = ?
//     `;

//     const [result] = await dbConnection().promise().query(query, [case_status, case_id]);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: 'Case not found' });
//     }

//     res.status(200).json({ message: 'Case status updated successfully' });
//   } catch (error) {
//     console.error('Error updating case status:', error);
//     res.status(500).json({ message: 'Error updating case status', error: error.message || error });
//   }
// });
// router.post('/update-password', verifyToken, async (req, res) => {
//   try {
//     const user_id = req.user.id; // User ID is passed from the verifyToken middleware
//     const { currentPassword, newPassword } = req.body;

//     if (!currentPassword || !newPassword) {
//       return res.status(400).json({ message: 'Current password and new password are required' });
//     }
//     const userQuery = `
//       SELECT id, password FROM users WHERE id = ?
//     `;
    
//     const [userResult] = await dbConnection().promise().query(userQuery, [user_id]);

//     if (userResult.length === 0) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const userData = userResult[0];
//     const isPasswordCorrect = await bcrypt.compare(currentPassword, userData.password);

//     if (!isPasswordCorrect) {
//       return res.status(400).json({ message: 'Incorrect current password' });
//     }
//     const hashedNewPassword = await bcrypt.hash(newPassword, 10);

//     const updatePasswordQuery = `
//       UPDATE users SET password = ? WHERE id = ?
//     `;
//     await dbConnection().promise().query(updatePasswordQuery, [hashedNewPassword, user_id]);

//     res.status(200).json({ message: 'Password updated successfully' });
//   } catch (error) {
//     console.error('Error updating password:', error);
//     res.status(500).json({ message: 'Error updating password', error: error.message || error });
//   }
// });



// router.post('/update-complaint-status', verifyToken, async (req, res) => {
//   try {
//     const { complaint_id, complaint_status } = req.body;

//     if (!complaint_id || !complaint_status) {
//       return res.status(400).json({ message: 'Missing required fields' });
//     }

//     const query = `
//       UPDATE complaints
//       SET complaint_status = ?
//       WHERE id = ?
//     `;

//     const [result] = await dbConnection().promise().query(query, [complaint_status, complaint_id]);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: 'Complaint not found' });
//     }

//     res.json({ message: 'Complaint status updated successfully' });
//   } catch (error) {
//     console.error('Error updating complaint status:', error);
//     res.status(500).json({ message: 'Error updating complaint status', error: error.message || error });
//   }
// });



// router.put('/update-attachment/:attachmentId', (req, res) => {
//   const attachmentId = req.params.attachmentId;
//   const { file_name, file_path, case_id, uploaded_by_user_id } = req.body;

//   // Validate incoming data
//   if (!file_name || !file_path || !case_id || !uploaded_by_user_id) {
//     return res.status(400).json({ error: 'All fields are required' });
//   }

//   // Update the attachment in the database
//   const query = `
//     UPDATE attachments
//     SET file_name = ?, file_path = ?, case_id = ?, uploaded_by_user_id = ?
//     WHERE id = ?
//   `;

//   const values = [file_name, file_path, case_id, uploaded_by_user_id, attachmentId];

//   db.query(query, values, (err, result) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).json({ error: 'Database error' });
//     }
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: 'Attachment not found' });
//     }
//     return res.status(200).json({ message: 'Attachment updated successfully' });
//   });
// });

// router.post('/update-session-status', verifyToken, async (req, res) => {
//   try {
//     const { session_id, status } = req.body;
    
//     if (!session_id || !status) {
//       return res.status(400).json({ message: 'Missing required fields' });
//     }

//     const query = `
//       UPDATE sessions 
//       SET session_status = ? 
//       WHERE id = ?
//     `;

//     const [result] = await dbConnection().promise().query(query, [status, session_id]);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: 'Session not found' });
//     }

//     res.status(200).json({ message: 'Session status updated successfully' });
//   } catch (error) {
//     console.error('Error updating session status:', error);
//     res.status(500).json({ message: 'Error updating session status', error: error.message || error });
//   }
// });


// router.post('/update-payment-status', verifyToken, async (req, res) => {
//   try {
//     const { payment_id, payment_status } = req.body;
//     if (!payment_id || !payment_status) {
//       return res.status(400).json({ message: 'Missing required fields' });
//     }
//     const query = `
//       UPDATE payments 
//       SET payment_status = ? 
//       WHERE id = ?
//     `;
//     const [result] = await dbConnection().promise().query(query, [payment_status, payment_id]);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: 'Payment not found' });
//     }
//     res.status(200).json({ message: 'Payment status updated successfully' });

//   } catch (error) {
//     console.error('Error updating payment status:', error);
//     res.status(500).json({ message: 'Error updating payment status', error: error.message || error });
//   }
// });





// /////////////Delete

// router.delete('/delete-user/:id', verifyToken, async (req, res) => {
//   const userId = req.params.id;

//   try {
//     const query = 'DELETE FROM users WHERE id = ?';

//     const [result] = await dbConnection().promise().query(query, [userId]);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.json({ message: 'User deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting user:', error);
//     res.status(500).json({ message: 'Error deleting user', error: error.message || error });
//   }
// });
// router.delete('/delete-attachment/:attachmentId', verifyToken, async (req, res) => {
//   const attachmentId = req.params.attachmentId; // Extract the attachmentId from the request parameters

//   try {
//     // SQL query to delete an attachment by its ID
//     const query = 'DELETE FROM attachments WHERE id = ?';
//     console.log('Executing query:', query, 'with attachmentId:', attachmentId); // Log query execution for debugging

//     const [result] = await dbConnection().promise().query(query, [attachmentId]);

//     // Check if any row was affected
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: 'Attachment not found or already deleted' });
//     }

//     // Return a success message
//     res.json({ message: 'Attachment deleted successfully' });
//   } catch (error) {
//     // Handle errors during the delete operation
//     console.error('Error deleting attachment:', error);
//     res.status(500).json({ message: 'Error deleting attachment', error: error.message || error });
//   }
// });
// router.delete('/delete-conversation/:conversationId', verifyToken, async (req, res) => {
//   const conversationId = req.params.conversationId; // Extract the conversationId from the request parameters

//   try {
//     // SQL query to delete a conversation by its ID
//     const query = 'DELETE FROM conversations WHERE id = ?';
//     console.log('Executing query:', query, 'with conversationId:', conversationId); // Log query execution for debugging

//     const [result] = await dbConnection().promise().query(query, [conversationId]);

//     // Check if any row was affected
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: 'Conversation not found or already deleted' });
//     }

//     // Return a success message
//     res.json({ message: 'Conversation deleted successfully' });
//   } catch (error) {
//     // Handle errors during the delete operation
//     console.error('Error deleting conversation:', error);
//     res.status(500).json({ message: 'Error deleting conversation', error: error.message || error });
//   }
// });


// router.delete('/delete-payment/:paymentId', verifyToken, async (req, res) => {
//   const paymentId  = req.params.paymentId; // Extract the paymentId from the request parameters

//   try {
//     // SQL query to delete a payment record by its ID
//     const query = 'DELETE FROM payments WHERE id = ?';
//     console.log('Executing query:', query, 'with paymentId:', paymentId); // Log query execution for debugging

//     const [result] = await dbConnection().promise().query(query, [paymentId]);

//     // Check if any row was affected
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: 'Payment record not found or already deleted' });
//     }

//     // Return a success message
//     res.json({ message: 'Payment record deleted successfully' });
//   } catch (error) {
//     // Handle errors during the delete operation
//     console.error('Error deleting payment record:', error);
//     res.status(500).json({ message: 'Error deleting payment record', error: error.message || error });
//   }
// });
// router.delete('/delete-session/:sessionId', verifyToken, async (req, res) => {
//   const sessionId = req.params.sessionId; // Extract the sessionId from the request parameters

//   try {
//     // SQL query to delete a session record by its ID
//     const query = 'DELETE FROM sessions WHERE id = ?';
//     console.log('Executing query:', query, 'with sessionId:', sessionId); // Log query execution for debugging

//     const [result] = await dbConnection().promise().query(query, [sessionId]);

//     // Check if any row was affected
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: 'Session record not found or already deleted' });
//     }

//     // Return a success message
//     res.json({ message: 'Session record deleted successfully' });
//   } catch (error) {
//     // Handle errors during the delete operation
//     console.error('Error deleting session record:', error);
//     res.status(500).json({ message: 'Error deleting session record', error: error.message || error });
//   }
// });

// router.delete('/delete-complaint/:complaintId', verifyToken, async (req, res) => {
//   const complaintId  = req.params.complaintId; // Extract the complaintId from the request parameters

//   try {
//     // SQL query to delete a complaint record by its ID
//     const query = 'DELETE FROM complaints WHERE id = ?';
//     console.log('Executing query:', query, 'with complaintId:', complaintId); // Log query execution for debugging

//     const [result] = await dbConnection().promise().query(query, [complaintId]);

//     // Check if any row was affected
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: 'Complaint record not found or already deleted' });
//     }

//     // Return a success message
//     res.json({ message: 'Complaint record deleted successfully' });
//   } catch (error) {
//     // Handle errors during the delete operation
//     console.error('Error deleting complaint record:', error);
//     res.status(500).json({ message: 'Error deleting complaint record', error: error.message || error });
//   }
// });
// router.delete('/delete-case/:caseId', verifyToken, async (req, res) => {
//   try {
//     const caseId  = req.params.caseId; // Extract the caseId from the request parameters

//     if (!caseId) {
//       return res.status(400).json({ message: 'Case ID is required' });
//     }

//     // Log the caseId for debugging
//     console.log('Received caseId:', caseId);

//     // SQL query to delete a case record by its ID
//     const query = 'DELETE FROM cases WHERE id = ?';
//     console.log('Executing query:', query, 'with caseId:', caseId); // Log query execution

//     const [result] = await dbConnection().promise().query(query, [caseId]);

//     // Check if any row was affected
//     if (result.affectedRows === 0) {
//       console.log('No rows affected, case not found or already deleted');
//       return res.status(404).json({ message: 'Case record not found or already deleted' });
//     }

//     // Return a success message
//     console.log('Case record deleted successfully');
//     res.json({ message: 'Case record deleted successfully' });
//   } catch (error) {
//     // Log detailed error
//     console.error('Error deleting case record:', error);

//     // Return a generic error message
//     res.status(500).json({ message: 'Error deleting case record', error: error.message || error });
//   }
// });

// router.delete('/delete-notification/:notificationId', verifyToken, async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const notificationId = req.params.notificationId;
//     const query = 'DELETE FROM notifications WHERE user_id = ? AND id = ?';
//     const [result] = await dbConnection().promise().query(query, [userId, notificationId]);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: 'Notification not found' });
//     }

//     res.json({ message: 'Notification deleted' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting notification', error: error.message || error });
//   }
// });

// module.exports = router;
const bcrypt = require('bcrypt'); // Use bcrypt instead of bcryptjs
const express = require('express');
const dbConnection = require('./dbconnection');
const verifyToken = require('./verifyToken'); 
const path = require('path');
const app = express();  // Initialize app
app.use('/uploads', (req, res, next) => {
  console.log(`Requesting: ${req.originalUrl}`);
  next();
}, express.static(path.join(__dirname, 'uploads')));

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



////////////////////////////////

router.get('/viewAll-attachments', verifyToken, async (req, res) => {
  try {
    const query = 'SELECT * FROM attachments';
    console.log('Executing query:', query);  
    const [result] = await dbConnection().promise().query(query);
        if (!result || result.length === 0) {
      return res.status(404).json({ message: 'No attachments found' });
    }

    res.json(result);
  } catch (error) {
    console.error('Error fetching attachments:', error);
    res.status(500).json({ message: 'Error fetching attachments', error: error.message || error });
  }
});

router.get('/viewAll-conversations', verifyToken, async (req, res) => {
  const userId = req.user.id; // Modify based on how user_id is passed

  try {
    const query = 'SELECT * FROM conversations WHERE receiver_id = ?';
    console.log('Executing query:', query);  
    const [result] = await dbConnection().promise().query(query, [userId]);
        if (!result || result.length === 0) {
      return res.status(404).json({ message: 'No conversations found' });
    }

    res.json(result);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ message: 'Error fetching conversations', error: error.message || error });
  }
});
router.get('/get-messages', verifyToken, async (req, res) => {
  const userId = req.user.id; // Get the user ID from the JWT token
  const senderId = req.query.sender_id; // Get the sender ID from the query parameters

  try {
    // Validate that the sender ID is provided
    if (!senderId) {
      return res.status(400).json({ message: 'Sender ID is required' });
    }

    // Query to fetch all messages between the current user (receiver) and the sender
    const query = `
      SELECT * FROM conversations
      WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
      ORDER BY send_time ASC`; // Ordering by send time to show the messages in order

    console.log('Executing query:', query);

    const [result] = await dbConnection().promise().query(query, [senderId, userId, userId, senderId]);

    // Check if any messages were found
    if (!result || result.length === 0) {
      return res.status(404).json({ message: 'No messages found for this conversation' });
    }

    // Return the messages as the response
    res.json({ messages: result });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Error fetching messages', error: error.message || error });
  }
});

router.post('/send-message', verifyToken, async (req, res) => {
  const { conversation_id, content, message_type = 'Text' } = req.body; // Default message_type to 'Text'
  const sender_id = req.user.id;

  console.log('Input conversation_id:', conversation_id);
  console.log('Input sender_id:', sender_id);

  try {
    // Check if required fields are missing
    if (!conversation_id || !content) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Fetch the receiver_id using the conversation_id
    const [conversation] = await dbConnection()
      .promise()
      .query(
        'SELECT receiver_id FROM conversations WHERE id = ? AND sender_id = ?',
        [conversation_id, sender_id]
      );

    // If no conversation is found, return an error
    if (conversation.length === 0) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    const receiver_id = conversation[0].receiver_id;

    // Insert the message into the 'messages' table
    const query = `
      INSERT INTO messages (sender_id, receiver_id, content, message_type, send_time)
      VALUES (?, ?, ?, ?, NOW())
    `;
    
    // Insert message into the database
    const [result] = await dbConnection().promise().query(query, [
      sender_id,
      receiver_id,
      content,
      message_type,
    ]);

    if (result.affectedRows === 1) {
      // Emit the message to the receiver's WebSocket if they are online
      const message = {
        sender_id,
        receiver_id,
        content,
        message_type,
        send_time: new Date().toISOString(),
      };

      const receiverSocketId = userSockets.get(receiver_id);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('new_message', message);
      }

      // Send success response
      res.status(201).json({
        message: 'Message sent successfully',
        message_id: result.insertId,
      });
    } else {
      res.status(500).json({ message: 'Failed to send message' });
    }
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      message: 'Error sending message',
      error: error.message || error,
    });
  }
});

// router.get('/viewAll-notifications', verifyToken, async (req, res) => {
//     try {
//         const userId = req.user.id; // Modify based on how user_id is passed
//         const query = 'SELECT * FROM notifications WHERE user_id = ?';
//         console.log('Executing query:', query);

//         const [result] = await dbConnection().promise().query(query, [userId]);

//         if (!result || result.length === 0) {
//             // Return 200 OK with an empty array
//             return res.status(200).json([]);
//         }

//         res.json(result);
//     } catch (error) {
//         console.error('Error fetching notifications:', error);
//         res.status(500).json({ message: 'Error fetching notifications', error: error.message || error });
//     }
// });

// router.get('/viewAll-notifications', verifyToken, async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const userRole = req.user.role;
//     let cases = [];
//     let query;

//     // 1. Fetch User's Cases based on Role
//     if (userRole === 'Lawyer') {
//       query = `
//       SELECT c.*
//       FROM cases c
//       INNER JOIN case_lawyers cl ON c.id = cl.case_id
//       WHERE cl.lawyer_id = ?
//     `;
//     } else if (userRole === 'Citizen') {
//          query = `
//           SELECT c.*
//           FROM cases c
//           INNER JOIN case_parties cp ON c.id = cp.case_id
//           WHERE cp.user_id = ?
//       `;
//     } else if (userRole === 'Judge') {
//         query = `SELECT * FROM cases WHERE judge_id = ?`;
//     } else {
//          return res.status(400).json({ message: 'Invalid user role.' });
//      }
    
//     const [caseRows] = await dbConnection().promise().query(query, [userId]);
//       cases = caseRows;

//     // 2. & 3. Check Upcoming Sessions and Generate Notifications
//     for (const caseItem of cases) {
//         const sessionQuery = 'SELECT * FROM sessions WHERE case_id = ?';
//         const [sessionRows] = await dbConnection().promise().query(sessionQuery, [caseItem.id]);
//         for(const session of sessionRows){
//             if (session.session_date) {
//               const sessionDate = new Date(session.session_date);
//               const now = new Date();
//               const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

//             if (sessionDate > now && sessionDate <= twentyFourHoursFromNow) {
//                // Fetch Parties related to the case (lawyers and citizens)
//                 const partiesQuery = `
//                 SELECT u.id AS user_id
//                 FROM users u
//                 LEFT JOIN case_lawyers cl ON u.id = cl.lawyer_id
//                 LEFT JOIN case_parties cp ON u.id = cp.user_id
//                 WHERE (cl.case_id = ? OR cp.case_id = ?)
//                 `;

//                const [partiesRows] = await dbConnection().promise().query(partiesQuery, [caseItem.id, caseItem.id]);
              
//                 for (const party of partiesRows) {
//                      const message = `Attention! You have a session for case #${caseItem.case_number} tomorrow, ${sessionDate.toLocaleTimeString()} on ${sessionDate.toLocaleDateString()} `;
//                    const notificationQuery = 'INSERT INTO notifications (user_id, notification_type, message) VALUES (?, ?, ?)';
//                      await dbConnection().promise().query(notificationQuery, [party.user_id, 'Session', message]);

//                 }
//             }
//           }
//       }
//     }

//     // 4. Fetch and Return All Notifications
//     const notificationsQuery = 'SELECT * FROM notifications WHERE user_id = ?';
//       const [notificationsRows] = await dbConnection().promise().query(notificationsQuery, [userId]);

//     res.json(notificationsRows);
//   } catch (error) {
//     console.error('Error processing notifications:', error);
//     res.status(500).json({ message: 'Error processing notifications', error: error.message || error });
//   }
// });
router.get('/viewAll-notifications', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    let cases = [];
    let query;

    // 1. Fetch User's Cases based on Role
    if (userRole === 'Lawyer') {
      query = `
      SELECT c.*
      FROM cases c
      INNER JOIN case_lawyers cl ON c.id = cl.case_id
      WHERE cl.lawyer_id = ?
    `;
    } else if (userRole === 'Citizen') {
         query = `
          SELECT c.*
          FROM cases c
          INNER JOIN case_parties cp ON c.id = cp.case_id
          WHERE cp.user_id = ?
      `;
    } else if (userRole === 'Judge') {
        query = `SELECT * FROM cases WHERE judge_id = ?`;
    } else {
         return res.status(400).json({ message: 'Invalid user role.' });
     }
    
    const [caseRows] = await dbConnection().promise().query(query, [userId]);
      cases = caseRows;

    // 2. & 3. Check Upcoming Sessions and Generate Notifications
    for (const caseItem of cases) {
        const sessionQuery = 'SELECT * FROM sessions WHERE case_id = ?';
        const [sessionRows] = await dbConnection().promise().query(sessionQuery, [caseItem.id]);
        for(const session of sessionRows){
            if (session.session_date) {
              const sessionDate = new Date(session.session_date);
              const now = new Date();
              const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

            if (sessionDate > now && sessionDate <= twentyFourHoursFromNow) {
               // Fetch Parties related to the case (lawyers and citizens)
                const partiesQuery = `
                SELECT u.id AS user_id
                FROM users u
                LEFT JOIN case_lawyers cl ON u.id = cl.lawyer_id
                LEFT JOIN case_parties cp ON u.id = cp.user_id
                WHERE (cl.case_id = ? OR cp.case_id = ?)
                `;

               const [partiesRows] = await dbConnection().promise().query(partiesQuery, [caseItem.id, caseItem.id]);
              
                for (const party of partiesRows) {
                     const message = `Attention! You have a session for case #${caseItem.case_number} tomorrow, ${sessionDate.toLocaleTimeString()} on ${sessionDate.toLocaleDateString()} `;

                     // ----------------------------- NEW CODE HERE -----------------------------
                     // Check if a notification with the same message already exists
                     const checkNotificationQuery = `
                     SELECT id FROM notifications
                     WHERE user_id = ? AND notification_type = ? AND message = ?
                     `;
                     const [existingNotification] = await dbConnection().promise().query(checkNotificationQuery, [party.user_id, 'Session', message]);

                     if (existingNotification && existingNotification.length > 0) {
                       // Notification already exists, skip inserting
                       continue;
                     }
                     // ----------------------------- END NEW CODE HERE -----------------------------

                   const notificationQuery = 'INSERT INTO notifications (user_id, notification_type, message) VALUES (?, ?, ?)';
                     await dbConnection().promise().query(notificationQuery, [party.user_id, 'Session', message]);

                }
            }
          }
      }
    }

    // 4. Fetch and Return All Notifications
    const notificationsQuery = 'SELECT * FROM notifications WHERE user_id = ?';
      const [notificationsRows] = await dbConnection().promise().query(notificationsQuery, [userId]);

    res.json(notificationsRows);
  } catch (error) {
    console.error('Error processing notifications:', error);
    res.status(500).json({ message: 'Error processing notifications', error: error.message || error });
  }
});
router.get('/viewAll-payments', verifyToken, async (req, res) => {
  try {
    const query = 'SELECT * FROM payments';
    console.log('Executing query:', query);  
    const [result] = await dbConnection().promise().query(query);
        if (!result || result.length === 0) {
      return res.status(404).json({ message: 'No payments found' });
    }

    res.json(result);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ message: 'Error fetching payments', error: error.message || error });
  }
});

router.get('/viewAll-sessions', verifyToken, async (req, res) => {
  try {
    const query = 'SELECT * FROM sessions';
    console.log('Executing query:', query);  
    const [result] = await dbConnection().promise().query(query);
        if (!result || result.length === 0) {
      return res.status(404).json({ message: 'No sessions found' });
    }

    res.json(result);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ message: 'Error fetching sessions', error: error.message || error });
  }
});


router.get('/viewAll-complaints', verifyToken, async (req, res) => {
  try {
    const query = 'SELECT * FROM complaints';
    console.log('Executing query:', query);  
    const [result] = await dbConnection().promise().query(query);
        if (!result || result.length === 0) {
      return res.status(404).json({ message: 'No complaints found' });
    }

    res.json(result);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ message: 'Error fetching complaints', error: error.message || error });
  }
});


router.get('/viewAll-cases', verifyToken, async (req, res) => {
  try {
    const query = 'SELECT * FROM cases';
    console.log('Executing query:', query);  
    const [result] = await dbConnection().promise().query(query);
        if (!result || result.length === 0) {
      return res.status(404).json({ message: 'No cases found' });
    }

    res.json(result);
    console.log(result);
  } catch (error) {
    console.error('Error fetching cases:', error);
    res.status(500).json({ message: 'Error fetching cases', error: error.message || error });
  }
});
router.get('/viewAll-users', verifyToken, async (req, res) => {
  try {
    const query = 'SELECT * FROM users';
    console.log('Executing query:', query);  
    const [result] = await dbConnection().promise().query(query);
        if (!result || result.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    res.json(result);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users', error: error.message || error });
  }
});


///////

// router.post('/create-admin', verifyToken, async (req, res) => {
//   const { username, password, email, phone_number, full_name, status } = req.body;

//   // Check for missing required fields
//   if (!username || !password || !email || !phone_number || !full_name) {
//     return res.status(400).json({ message: 'Missing required fields' });
//   }

//   // Default value for status if not provided
//   const userStatus = status || 'Active';

//   try {
//     // Insert query to add the user
//     const query = `
//       INSERT INTO users (username, password, role, email, phone_number, full_name, status)
//       VALUES (?, ?, 'Admin', ?, ?, ?, ?)
//     `;

//     // Execute the query
//     const [result] = await dbConnection().promise().query(query, [username, password, email, phone_number, full_name, userStatus]);

//     res.status(201).json({ message: 'Admin user created successfully', userId: result.insertId });
//   } catch (error) {
//     console.error('Error creating admin user:', error);
//     res.status(500).json({ message: 'Error creating admin user', error: error.message || error });
//   }
// });


router.post('/create-admin', verifyToken, async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ message: 'Missing username' });
  }

  try {
    // Update query to change the user's role to admin
    const query = `
      UPDATE users
      SET role = 'Admin'
      WHERE username = ?
    `;

    // Execute the query
    const [result] = await dbConnection().promise().query(query, [username]);

    // Check if any rows were affected
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User role updated to Admin successfully' });

  } catch (error) {
    console.error('Error updating user to admin:', error);
    res.status(500).json({ message: 'Error updating user to admin', error: error.message || error });
  }
});


router.post('/get-my-info', verifyToken, async (req, res) => {
  try {
    const user_id = req.user.id; // User ID is passed from the verifyToken middleware

    if (!user_id) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Query to retrieve user information including hashed password and profile picture
    const userQuery = `
      SELECT id, username, email, full_name, phone_number, password, bio, profile_picture
      FROM users
      WHERE id = ?
    `;

    const [userResult] = await dbConnection().promise().query(userQuery, [user_id]);

    if (userResult.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userData = userResult[0]; // Assuming only one user is returned

    // Do not include the password in the response
    res.status(200).json({
      message: 'User information retrieved successfully',
      user: {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        fullName: userData.full_name,
        phoneNumber: userData.phone_number,
        bio: userData.bio,
        profilePic: userData.profile_picture,  // Assuming 'profile_pic' is the path or URL to the profile image
      }
    });
  } catch (error) {
    console.error('Error retrieving user:', error);
    res.status(500).json({ message: 'Error retrieving user information', error: error.message || error });
  }
});router.post('/get-payments', verifyToken, async (req, res) => {
  try {
    const { case_id } = req.body;

    if (!case_id) {
      return res.status(400).json({ message: 'Case ID is required' });
    }

    const paymentQuery = `
      SELECT id, case_id, amount, payment_date, payment_status
      FROM payments
      WHERE case_id = ?
    `;
    const [paymentResults] = await dbConnection().promise().query(paymentQuery, [case_id]);

    if (paymentResults.length === 0) {
        return res.status(200).json({ message: 'No payments found for this case', payments: [] }); // Return 200 with an empty array
    }

    const paymentsData = paymentResults.map(payment => ({
      id: payment.id,
      amount: payment.amount,
      paymentDate: payment.payment_date,
      paymentStatus: payment.payment_status
    }));
    console.log(paymentResults);
    res.status(200).json({
      message: 'Payments retrieved successfully',
      payments: paymentsData
    });
  } catch (error) {
    console.error('Error retrieving payments:', error);
    res.status(500).json({ message: 'Error retrieving payments', error: error.message || error });
  }
});
router.post('/get-sessions', verifyToken, async (req, res) => {
  try {
    const { case_id } = req.body;

    if (!case_id) {
      return res.status(400).json({ message: 'Case ID is required' });
    }

    const sessionQuery = `
      SELECT id, case_id, session_date, session_details, session_status
      FROM sessions
      WHERE case_id = ? AND case_id != 9
    `;

    const [sessionResults] = await dbConnection().promise().query(sessionQuery, [case_id]);

    if (sessionResults.length === 0) {
      return res.status(200).json({ message: 'No sessions found for this case', sessions: [] }); // Return 200 with empty array
    }

    const sessionsData = sessionResults.map(session => ({
      id: session.id,
      sessionDate: session.session_date,
      sessionDetails: session.session_details,
      sessionStatus: session.session_status
    }));

    console.log(sessionResults);
    res.status(200).json({
      message: 'Sessions retrieved successfully',
      sessions: sessionsData
    });
  } catch (error) {
    console.error('Error retrieving sessions:', error);
    res.status(500).json({ message: 'Error retrieving sessions', error: error.message || error });
  }
});

// router.post('/get-attachment', verifyToken, async (req, res) => {
//   try {
//     const { case_id } = req.body; // Assuming you're passing case_id in the request body

//     if (!case_id) {
//       return res.status(400).json({ message: 'Case ID is required' });
//     }

//     // Query to retrieve attachments related to the case_id
//     const attachmentQuery = `
//       SELECT id, case_id, file_path, file_type, uploaded_by_user_id, upload_time
//       FROM attachments
//       WHERE case_id = ?
//     `;

//     const [attachmentResults] = await dbConnection().promise().query(attachmentQuery, [case_id]);

//     if (attachmentResults.length === 0) {
//       return res.status(404).json({ message: 'No attachments found for this case' });
//     }

//     const attachmentsData = attachmentResults.map(attachment => ({
//       id: attachment.id,
//       filePath: attachment.file_path,
//       fileType: attachment.file_type,
//       uploadedByUserId: attachment.uploaded_by_user_id,
//       uploadTime: attachment.upload_time
//     }));

//     console.log(attachmentResults); // Log the attachment data for debugging
//     res.status(200).json({
//       message: 'Attachments retrieved successfully',
//       attachments: attachmentsData
//     });
//   } catch (error) {
//     console.error('Error retrieving attachments:', error);
//     res.status(500).json({ message: 'Error retrieving attachments', error: error.message || error });
//   }
// });
router.post('/get-attachment', verifyToken, async (req, res) => {
  try {
    const { case_id } = req.body;

    if (!case_id) {
      return res.status(400).json({ message: 'Case ID is required' });
    }

    const attachmentQuery = `
      SELECT id, case_id, file_path, file_type, uploaded_by_user_id, upload_time
      FROM attachments
      WHERE case_id = ?
    `;

    const [attachmentResults] = await dbConnection().promise().query(attachmentQuery, [case_id]);

    if (attachmentResults.length === 0) {
      return res.status(200).json({ message: 'No attachments found for this case', attachments: [] }); // Return 200 with empty array
    }

    const attachmentsData = attachmentResults.map(attachment => ({
      id: attachment.id,
      filePath: attachment.file_path,
      fileType: attachment.file_type,
      uploadedByUserId: attachment.uploaded_by_user_id,
      uploadTime: attachment.upload_time
    }));

    console.log(attachmentResults);
    res.status(200).json({
      message: 'Attachments retrieved successfully',
      attachments: attachmentsData
    });
  } catch (error) {
    console.error('Error retrieving attachments:', error);
    res.status(500).json({ message: 'Error retrieving attachments', error: error.message || error });
  }
});

// router.post('/get-complaint', verifyToken, async (req, res) => {
//   try {
//     const { case_id } = req.body; // Assuming you're passing case_id in the request body

//     if (!case_id) {
//       return res.status(400).json({ message: 'Case ID is required' });
//     }

//     // Query to retrieve complaints related to the case_id
//     const complaintQuery = `
//       SELECT id, case_id, complaint_type, complaint_details, complainant_id, accused_id, complaint_status, creation_date
//       FROM complaints
//       WHERE case_id = ?
//     `;

//     const [complaintResults] = await dbConnection().promise().query(complaintQuery, [case_id]);

//     if (complaintResults.length === 0) {
//       return res.status(404).json({ message: 'No complaints found for this case' });
//     }

//     const complaintsData = complaintResults.map(complaint => ({
//       id: complaint.id,
//       caseId: complaint.case_id,
//       complaintType: complaint.complaint_type,
//       complaintDetails: complaint.complaint_details,
//       complainantId: complaint.complainant_id,
//       accusedId: complaint.accused_id,
//       complaintStatus: complaint.complaint_status,
//       creationDate: complaint.creation_date
//     }));

//     console.log(complaintResults); // Log the complaint data for debugging
//     res.status(200).json({
//       message: 'Complaints retrieved successfully',
//       complaints: complaintsData
//     });
//   } catch (error) {
//     console.error('Error retrieving complaints:', error);
//     res.status(500).json({ message: 'Error retrieving complaints', error: error.message || error });
//   }
// });
router.post('/get-complaint', verifyToken, async (req, res) => {
  try {
    const { case_id } = req.body;

    if (!case_id) {
      return res.status(400).json({ message: 'Case ID is required' });
    }

    const complaintQuery = `
      SELECT id, case_id, complaint_type, complaint_details, complainant_id, accused_id, complaint_status, creation_date
      FROM complaints
      WHERE case_id = ?
    `;

    const [complaintResults] = await dbConnection().promise().query(complaintQuery, [case_id]);

    if (complaintResults.length === 0) {
      return res.status(200).json({ message: 'No complaints found for this case', complaints: [] }); // Return 200 with an empty array
    }

    const complaintsData = complaintResults.map(complaint => ({
      id: complaint.id,
      caseId: complaint.case_id,
      complaintType: complaint.complaint_type,
      complaintDetails: complaint.complaint_details,
      complainantId: complaint.complainant_id,
      accusedId: complaint.accused_id,
      complaintStatus: complaint.complaint_status,
      creationDate: complaint.creation_date
    }));

    console.log(complaintResults);
    res.status(200).json({
      message: 'Complaints retrieved successfully',
      complaints: complaintsData
    });
  } catch (error) {
    console.error('Error retrieving complaints:', error);
    res.status(500).json({ message: 'Error retrieving complaints', error: error.message || error });
  }
});

router.post('/get-user-info', verifyToken, async (req, res) => {
  try {
    const { user_id } = req.body; // Assuming you're passing the user_id in the request body

    if (!user_id) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Query to retrieve user information including pic
    const userQuery = `
      SELECT id, username, email, full_name, phone_number, bio, profile_picture
      FROM users
      WHERE id = ?
    `;

    const [userResult] = await dbConnection().promise().query(userQuery, [user_id]);

    if (userResult.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userData = userResult[0]; // Assuming only one user is returned

    res.status(200).json({
      message: 'User information retrieved successfully',
      user: {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        fullName: userData.full_name,
        phoneNumber: userData.phone_number,
        bio: userData.bio,
        profilePic: userData.profile_picture,  // Assuming 'profile_pic' is the path or URL to the profile image
      }
    });
  } catch (error) {
    console.error('Error retrieving user:', error);
    res.status(500).json({ message: 'Error retrieving user information', error: error.message || error });
  }
});




router.post('/create-notification', verifyToken, async (req, res) => {
  try {
    const { user_id, notification_type, message } = req.body;
    if (!user_id || !notification_type || !message) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const query = `
      INSERT INTO notifications (user_id, notification_type, message, is_read)
      VALUES (?, ?, ?, 0)
    `;
    const [result] = await dbConnection().promise().query(query, [user_id, notification_type, message]);
    res.status(201).json({ message: 'Notification created successfully', notificationId: result.insertId });

  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ message: 'Error creating notification', error: error.message || error });
  }
});




router.post('/create-conversation', verifyToken, async (req, res) => {
  try {
    const { sender_id, receiver_id, content, message_type } = req.body;
    if (!sender_id || !receiver_id || !content || !message_type) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const query = `
      INSERT INTO conversations (sender_id, receiver_id, content, message_type)
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await dbConnection().promise().query(query, [sender_id, receiver_id, content, message_type]);

    res.status(201).json({ message: 'Conversation created successfully', conversationId: result.insertId });

  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({ message: 'Error creating conversation', error: error.message || error });
  }
});

router.post('/mark-conversation-read', verifyToken, async (req, res) => {
  try {
    const { conversation_id } = req.body; 
    if (!conversation_id) {
      return res.status(400).json({ message: 'Missing conversation_id' });
    }
    const query = `
      UPDATE conversations
      SET is_read = 1
      WHERE id = ?
    `;

    const [result] = await dbConnection().promise().query(query, [conversation_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    res.status(200).json({ message: 'Conversation marked as read successfully' });

  } catch (error) {
    console.error('Error marking conversation as read:', error);
    res.status(500).json({ message: 'Error marking conversation as read', error: error.message || error });
  }
});

router.post('/markAll-notifications-read', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id; // Get user_id from the authenticated token
    console.log('Marking all notifications as read for user:', userId);

    const query = 'UPDATE notifications SET is_read = 1 WHERE user_id = ? AND is_read = 0'; // Only mark unread notifications
    console.log('Executing query:', query);

    // Execute the query
    const [result] = await dbConnection().promise().query(query, [userId]);

    if (result.affectedRows === 0) {
      console.log(`No unread notifications found for userId: ${userId}`);
      return res.status(404).json({ message: 'No unread notifications found' });
    }
    console.log(`Successfully marked ${result.affectedRows} notifications as read for userId: ${userId}`);
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ message: 'Error marking all notifications as read', error: error.message || error });
  }
});

router.post('/markAll-conversations-read', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id; // Get user_id from the authenticated token
    console.log('Marking all conversations as read for user:', userId);

    const query = 'UPDATE conversations SET is_read = 1 WHERE receiver_id = ? AND is_read = 0'; // Only mark unread notifications
    console.log('Executing query:', query);

    // Execute the query
    const [result] = await dbConnection().promise().query(query, [userId]);

    if (result.affectedRows === 0) {
      console.log(`No unread conversations found for userId: ${userId}`);
      return res.status(404).json({ message: 'No unread conversations found' });
    }

    console.log(`Successfully marked ${result.affectedRows} conversations as read for userId: ${userId}`);
    res.json({ message: 'All conversations marked as read' });
  } catch (error) {
    console.error('Error marking all conversations as read:', error);
    res.status(500).json({ message: 'Error marking all conversations as read', error: error.message || error });
  }
});
router.put('/mark-notification-read/:notificationId', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id; 
    const notificationId = req.params.notificationId; // Get the notification ID from URL parameters
    const query = 'UPDATE notifications SET is_read = 1 WHERE user_id = ? AND id = ?';

    console.log('Executing query:', query);

    const [result] = await dbConnection().promise().query(query, [userId, notificationId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Notification not found or already marked as read' });
    }

    res.json({ message: `Notification ${notificationId} marked as read` });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Error marking notification as read', error: error.message || error });
  }
});
router.put('/mark-conversation-read/:conversationId', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id; 
    const conversationId = req.params.conversationId; // Get the notification ID from URL parameters
    const query = 'UPDATE conversations SET is_read = 1 WHERE receiver_id = ? AND id = ?';

    console.log('Executing query:', query);

    const [result] = await dbConnection().promise().query(query, [userId, conversationId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Conversation not found or already marked as read' });
    }

    res.json({ message: `Conversation ${conversationId} marked as read` });
  } catch (error) {
    console.error('Error marking conversation as read:', error);
    res.status(500).json({ message: 'Error marking conversation as read', error: error.message || error });
  }
});



router.post('/add-case', verifyToken, async (req, res) => {
  try {
    const { case_number, case_type, case_status, plaintiff_id, defendant_id, lawyer_id, judge_id, court_name, court_type, session_date, session_status, next_session_date } = req.body;

    if (!case_number || !case_type || !case_status || !plaintiff_id || !defendant_id || !lawyer_id || !judge_id || !court_name || !court_type || !session_date || !session_status || !next_session_date) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const query = `
      INSERT INTO cases (case_number, case_type, case_status, plaintiff_id, defendant_id, lawyer_id, judge_id, court_name, court_type, session_date, session_status, next_session_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await dbConnection().promise().query(query, [case_number, case_type, case_status, plaintiff_id, defendant_id, lawyer_id, judge_id, court_name, court_type, session_date, session_status, next_session_date]);

    res.status(201).json({ message: 'Case created successfully', caseId: result.insertId });
  } catch (error) {
    console.error('Error creating case:', error);
    res.status(500).json({ message: 'Error creating case', error: error.message || error });
  }
});
router.get('/total-users', verifyToken, async (req, res) => {
  try {
    const query = 'SELECT COUNT(*) AS total FROM users';
    console.log('Executing query:', query);  // Log the query for debugging

    // Execute the query using the promise-based API
    const [result] = await dbConnection().promise().query(query);
        if (!result || result.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    res.json(result[0]);
  } catch (error) {
    console.error('Error fetching total users:', error);
    res.status(500).json({ message: 'Error fetching total users', error: error.message || error });
  }
});

router.post('/add-complaint', verifyToken, async (req, res) => {
  try {
    const { case_id, complaint_type, complaint_details, complainant_id, accused_id, complaint_status } = req.body;

    if (!case_id || !complaint_type || !complaint_details || !complainant_id || !accused_id) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const query = `
      INSERT INTO complaints (case_id, complaint_type, complaint_details, complainant_id, accused_id, complaint_status)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await dbConnection().promise().query(query, [case_id, complaint_type, complaint_details, complainant_id, accused_id, complaint_status]);

    res.status(201).json({ message: 'Complaint added successfully', complaintId: result.insertId });
  } catch (error) {
    console.error('Error adding complaint:', error);
    res.status(500).json({ message: 'Error adding complaint', error: error.message || error });
  }
});
router.post('/add-attachment', verifyToken, async (req, res) => {
  try {
    const { case_id, file_path, file_type, uploaded_by_user_id } = req.body;
    if (!case_id || !file_path || !file_type || !uploaded_by_user_id) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const query = `
      INSERT INTO attachments (case_id, file_path, file_type, uploaded_by_user_id)
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await dbConnection().promise().query(query, [case_id, file_path, file_type, uploaded_by_user_id]);

    res.status(201).json({ message: 'Attachment added successfully', attachmentId: result.insertId });
  } catch (error) {
    console.error('Error adding attachment:', error);
    res.status(500).json({ message: 'Error adding attachment', error: error.message || error });
  }
});

router.post('/add-payment', verifyToken, async (req, res) => {
  try {
    const { case_id, amount, payment_status } = req.body;
    if (!case_id || !amount || !payment_status) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const query = `
      INSERT INTO payments (case_id, amount, payment_status)
      VALUES (?, ?, ?)
    `;
    const [result] = await dbConnection().promise().query(query, [case_id, amount, payment_status]);
    res.status(201).json({ message: 'Payment created successfully', paymentId: result.insertId });

  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ message: 'Error creating payment', error: error.message || error });
  }
});

// Route to get the number of active cases
router.get('/active-cases', verifyToken, async (req, res) => {
  try {
    const query = 'SELECT COUNT(*) AS active_cases FROM cases WHERE case_status = "Ongoing"';
    console.log('Executing query:', query);  // Log the query for debugging

    const [result] = await dbConnection().promise().query(query);
    if (!result || result.length === 0) {
      return res.status(404).json({ message: 'No active cases found' });
    }

    res.json(result[0]);
  } catch (error) {
    console.error('Error fetching active cases:', error);
    res.status(500).json({ message: 'Error fetching active cases', error: error.message || error });
  }
});

// Route to get total pending payments
router.get('/pending-payments', verifyToken, async (req, res) => {
  try {
    const query = 'SELECT COUNT(*) AS pending_payments FROM payments WHERE payment_status = "Pending"';
    console.log('Executing query:', query);  // Log the query for debugging

    const [result] = await dbConnection().promise().query(query);
    if (!result || result.length === 0) {
      return res.status(404).json({ message: 'No pending payments found' });
    }

    res.json(result[0]);
  } catch (error) {
    console.error('Error fetching pending payments:', error);
    res.status(500).json({ message: 'Error fetching pending payments', error: error.message || error });
  }
});

// Route to get unread notifications count
router.get('/unread-notifications', verifyToken, async (req, res) => {
  try {
    const query = 'SELECT COUNT(*) AS unread_notifications FROM notifications WHERE is_read = 0';
    console.log('Executing query:', query);  // Log the query for debugging

    const [result] = await dbConnection().promise().query(query);
    if (!result || result.length === 0) {
      return res.status(404).json({ message: 'No unread notifications found' });
    }

    res.json(result[0]);
  } catch (error) {
    console.error('Error fetching unread notifications:', error);
    res.status(500).json({ message: 'Error fetching unread notifications', error: error.message || error });
  }
});

router.delete('/delete-all-notifications', verifyToken, async (req, res) => {
  try {

    const userId = req.user.id;
    console.log('the id to the user that i need to delet notification to him $userId');
    console.log(userId);
    const query = 'DELETE FROM notifications WHERE user_id = ?';
    const [result] = await dbConnection().promise().query(query, [userId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'No notifications found for deletion' });
    }
    res.json({ message: 'All notifications deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting notifications', error: error.message || error });
  }
});
//delete spicific notification
router.delete('/notifications/:id', verifyToken, async (req, res) => {
  const { id } = req.params; // Correct way to extract the id
  console.log('the recive data from front is ');
  console.log(req.params)

  try {
    const query = 'DELETE FROM notifications WHERE id = ?';
    console.log('Executing query:', query, 'with ID:', id); // Log query execution for debugging

    const [result] = await dbConnection().promise().query(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Notification not found or already deleted' });
    }

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: 'Error deleting notification', error: error.message || error });
  }
});

router.post('/create-session', verifyToken, async (req, res) => {
  try {
    const { case_id, session_date, session_details, session_status } = req.body;

    if (!case_id || !session_date || !session_details || !session_status) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const query = `
      INSERT INTO sessions (case_id, session_date, session_details, session_status)
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await dbConnection().promise().query(query, [case_id, session_date, session_details, session_status]);

    res.status(201).json({ message: 'Session created successfully', sessionId: result.insertId });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ message: 'Error creating session', error: error.message || error });
  }
});


router.post('/update-fcm-token', async (req, res) => {
  const authHeader = req.headers['authorization'];
 const token = authHeader && authHeader.split(' ')[1];
 if (!token) {
        return res.status(401).send('Access Denied.');
   }
   try {
   const fcmToken = req.body.fcmToken;
   const userId = req.body.userId; // Get the userId from the request body.
   if(!fcmToken || !userId){
          return res.status(400).send('Missing FCM Token or User ID.');
   }

   if (user.id.toString() !== userId) {
      return res.status(401).send('Unauthorized.');
    }


   const query = 'UPDATE users SET fcmToken = ? WHERE id = ?';
    const [rows] = await dbConnection().promise().query(query, [fcmToken, userId]);

   if (rows && rows.affectedRows > 0) {
       console.log(`FCM Token updated for user ${userId}`);
       res.status(200).send('FCM Token updated successfully.');
   } else {
        res.status(400).send('User not found or no update made.');
   }
 } catch (error){
       res.status(500).send('Failed to update fcm token due to internal error.');
     console.log(`Error updating FCM token to database for user ${userId}:`, error);
 }
});




//////   update 
router.put('/update-user-status/:id', verifyToken, async (req, res) => {
  const userId = req.params.id;
  const { status } = req.body;  // Assuming status is passed in the request body

  if (!status) {
    return res.status(400).json({ message: 'Status is required' });
  }

  try {
    const query = 'UPDATE users SET status = ? WHERE id = ?';

    const [result] = await dbConnection().promise().query(query, [status, userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User status updated successfully' });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ message: 'Error updating user status', error: error.message || error });
  }
});


router.post('/update-notification-status', verifyToken, async (req, res) => {
  try {
    const { notification_id } = req.body;
    if (!notification_id) {
      return res.status(400).json({ message: 'Missing notification ID' });
    }

    const query = `
      UPDATE notifications
      SET is_read = 1
      WHERE id = ?
    `;

    const [result] = await dbConnection().promise().query(query, [notification_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.status(200).json({ message: 'Notification status updated successfully' });

  } catch (error) {
    console.error('Error updating notification status:', error);
    res.status(500).json({ message: 'Error updating notification status', error: error.message || error });
  }
});


router.put('/update-profile', verifyToken, async (req, res) => {
  try {
    // Extracting data from the request body
    const { username, email, phone_number, full_name, profile_picture, bio } = req.body;

    // Validate the incoming data
    if (!username || !email) {
      return res.status(400).json({ message: 'Username and email are required' });
    }

    // Build the query dynamically depending on which fields are provided
    let query = 'UPDATE users SET ';
    const values = [];

    // Conditionally add fields to the query and values array
    if (username) {
      query += 'username = ?, ';
      values.push(username);
    }
    if (email) {
      query += 'email = ?, ';
      values.push(email);
    }
    if (phone_number) {
      query += 'phone_number = ?, ';
      values.push(phone_number);
    }
    if (full_name) {
      query += 'full_name = ?, ';
      values.push(full_name);
    }
    if (profile_picture) {
      query += 'profile_picture = ?, ';
      values.push(profile_picture);
    }
    if (bio) {
      query += 'bio = ?, ';
      values.push(bio);
    }

    // Remove the last comma and space
    query = query.slice(0, -2);

    // Add the WHERE clause to identify the user by their ID (assuming the user ID is in req.user)
    query += ' WHERE id = ?';
    values.push(req.user.id); // Assuming `req.user.id` contains the authenticated user's ID

    // Execute the query
    const [result] = await dbConnection().promise().query(query, values);

    // Check if any row was updated
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Respond with success message
    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile', error: error.message || error });
  }
});

router.put('/update-case-status', verifyToken, async (req, res) => {
  try {
    const { case_id, case_status } = req.body;

    if (!case_id || !case_status) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const query = `
      UPDATE cases 
      SET case_status = ? 
      WHERE id = ?
    `;

    const [result] = await dbConnection().promise().query(query, [case_status, case_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Case not found' });
    }

    res.status(200).json({ message: 'Case status updated successfully' });
  } catch (error) {
    console.error('Error updating case status:', error);
    res.status(500).json({ message: 'Error updating case status', error: error.message || error });
  }
});
router.post('/update-password', verifyToken, async (req, res) => {
  try {
    const user_id = req.user.id; // User ID is passed from the verifyToken middleware
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }
    const userQuery = `
      SELECT id, password FROM users WHERE id = ?
    `;
    
    const [userResult] = await dbConnection().promise().query(userQuery, [user_id]);

    if (userResult.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userData = userResult[0];
    const isPasswordCorrect = await bcrypt.compare(currentPassword, userData.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Incorrect current password' });
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    const updatePasswordQuery = `
      UPDATE users SET password = ? WHERE id = ?
    `;
    await dbConnection().promise().query(updatePasswordQuery, [hashedNewPassword, user_id]);

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Error updating password', error: error.message || error });
  }
});



router.post('/update-complaint-status', verifyToken, async (req, res) => {
  try {
    const { complaint_id, complaint_status } = req.body;

    if (!complaint_id || !complaint_status) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const query = `
      UPDATE complaints
      SET complaint_status = ?
      WHERE id = ?
    `;

    const [result] = await dbConnection().promise().query(query, [complaint_status, complaint_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json({ message: 'Complaint status updated successfully' });
  } catch (error) {
    console.error('Error updating complaint status:', error);
    res.status(500).json({ message: 'Error updating complaint status', error: error.message || error });
  }
});



router.put('/update-attachment/:attachmentId', (req, res) => {
  const attachmentId = req.params.attachmentId;
  const { file_name, file_path, case_id, uploaded_by_user_id } = req.body;

  // Validate incoming data
  if (!file_name || !file_path || !case_id || !uploaded_by_user_id) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Update the attachment in the database
  const query = `
    UPDATE attachments
    SET file_name = ?, file_path = ?, case_id = ?, uploaded_by_user_id = ?
    WHERE id = ?
  `;

  const values = [file_name, file_path, case_id, uploaded_by_user_id, attachmentId];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Attachment not found' });
    }
    return res.status(200).json({ message: 'Attachment updated successfully' });
  });
});

router.post('/update-session-status', verifyToken, async (req, res) => {
  try {
    const { session_id, status } = req.body;
    
    if (!session_id || !status) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const query = `
      UPDATE sessions 
      SET session_status = ? 
      WHERE id = ?
    `;

    const [result] = await dbConnection().promise().query(query, [status, session_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.status(200).json({ message: 'Session status updated successfully' });
  } catch (error) {
    console.error('Error updating session status:', error);
    res.status(500).json({ message: 'Error updating session status', error: error.message || error });
  }
});


router.post('/update-payment-status', verifyToken, async (req, res) => {
  try {
    const { payment_id, payment_status } = req.body;
    if (!payment_id || !payment_status) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const query = `
      UPDATE payments 
      SET payment_status = ? 
      WHERE id = ?
    `;
    const [result] = await dbConnection().promise().query(query, [payment_status, payment_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.status(200).json({ message: 'Payment status updated successfully' });

  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ message: 'Error updating payment status', error: error.message || error });
  }
});





/////////////Delete

router.delete('/delete-user/:id', verifyToken, async (req, res) => {
  const userId = req.params.id;

  try {
    const query = 'DELETE FROM users WHERE id = ?';

    const [result] = await dbConnection().promise().query(query, [userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user', error: error.message || error });
  }
});
router.delete('/delete-attachment/:attachmentId', verifyToken, async (req, res) => {
  const attachmentId = req.params.attachmentId; // Extract the attachmentId from the request parameters

  try {
    // SQL query to delete an attachment by its ID
    const query = 'DELETE FROM attachments WHERE id = ?';
    console.log('Executing query:', query, 'with attachmentId:', attachmentId); // Log query execution for debugging

    const [result] = await dbConnection().promise().query(query, [attachmentId]);

    // Check if any row was affected
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Attachment not found or already deleted' });
    }

    // Return a success message
    res.json({ message: 'Attachment deleted successfully' });
  } catch (error) {
    // Handle errors during the delete operation
    console.error('Error deleting attachment:', error);
    res.status(500).json({ message: 'Error deleting attachment', error: error.message || error });
  }
});
router.delete('/delete-conversation/:conversationId', verifyToken, async (req, res) => {
  const conversationId = req.params.conversationId; // Extract the conversationId from the request parameters

  try {
    // SQL query to delete a conversation by its ID
    const query = 'DELETE FROM conversations WHERE id = ?';
    console.log('Executing query:', query, 'with conversationId:', conversationId); // Log query execution for debugging

    const [result] = await dbConnection().promise().query(query, [conversationId]);

    // Check if any row was affected
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Conversation not found or already deleted' });
    }

    // Return a success message
    res.json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    // Handle errors during the delete operation
    console.error('Error deleting conversation:', error);
    res.status(500).json({ message: 'Error deleting conversation', error: error.message || error });
  }
});


router.delete('/delete-payment/:paymentId', verifyToken, async (req, res) => {
  const paymentId  = req.params.paymentId; // Extract the paymentId from the request parameters

  try {
    // SQL query to delete a payment record by its ID
    const query = 'DELETE FROM payments WHERE id = ?';
    console.log('Executing query:', query, 'with paymentId:', paymentId); // Log query execution for debugging

    const [result] = await dbConnection().promise().query(query, [paymentId]);

    // Check if any row was affected
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Payment record not found or already deleted' });
    }

    // Return a success message
    res.json({ message: 'Payment record deleted successfully' });
  } catch (error) {
    // Handle errors during the delete operation
    console.error('Error deleting payment record:', error);
    res.status(500).json({ message: 'Error deleting payment record', error: error.message || error });
  }
});
router.delete('/delete-session/:sessionId', verifyToken, async (req, res) => {
  const sessionId = req.params.sessionId; // Extract the sessionId from the request parameters

  try {
    // SQL query to delete a session record by its ID
    const query = 'DELETE FROM sessions WHERE id = ?';
    console.log('Executing query:', query, 'with sessionId:', sessionId); // Log query execution for debugging

    const [result] = await dbConnection().promise().query(query, [sessionId]);

    // Check if any row was affected
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Session record not found or already deleted' });
    }

    // Return a success message
    res.json({ message: 'Session record deleted successfully' });
  } catch (error) {
    // Handle errors during the delete operation
    console.error('Error deleting session record:', error);
    res.status(500).json({ message: 'Error deleting session record', error: error.message || error });
  }
});

router.delete('/delete-complaint/:complaintId', verifyToken, async (req, res) => {
  const complaintId  = req.params.complaintId; // Extract the complaintId from the request parameters

  try {
    // SQL query to delete a complaint record by its ID
    const query = 'DELETE FROM complaints WHERE id = ?';
    console.log('Executing query:', query, 'with complaintId:', complaintId); // Log query execution for debugging

    const [result] = await dbConnection().promise().query(query, [complaintId]);

    // Check if any row was affected
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Complaint record not found or already deleted' });
    }

    // Return a success message
    res.json({ message: 'Complaint record deleted successfully' });
  } catch (error) {
    // Handle errors during the delete operation
    console.error('Error deleting complaint record:', error);
    res.status(500).json({ message: 'Error deleting complaint record', error: error.message || error });
  }
});

// router.delete('/delete-case/:caseId', verifyToken, async (req, res) => {
//   try {
//     const caseId  = req.params.caseId; // Extract the caseId from the request parameters
//     if (!caseId) {
//       return res.status(400).json({ message: 'Case ID is required' });
//     }
//     // Log the caseId for debugging
//     console.log('Received caseId:', caseId);
//     // SQL query to delete a case record by its ID
//     const query = 'DELETE FROM cases WHERE id = ?';
//     console.log('Executing query:', query, 'with caseId:', caseId); // Log query execution
//     const [result] = await dbConnection().promise().query(query, [caseId]);
//     // Check if any row was affected
//     if (result.affectedRows === 0) {
//       console.log('No rows affected, case not found or already deleted');
//       return res.status(404).json({ message: 'Case record not found or already deleted' });
//     }
//     // Return a success message
//     console.log('Case record deleted successfully');
//     res.json({ message: 'Case record deleted successfully' });
//   } catch (error) {
//     // Log detailed error
//     console.error('Error deleting case record:', error);
//     // Return a generic error message
//     res.status(500).json({ message: 'Error deleting case record', error: error.message || error });
//   }
// });
router.delete('/delete-case/:caseId', verifyToken, async (req, res) => {
  try {
    const caseId = req.params.caseId;
    if (!caseId) {
      return res.status(400).json({ message: 'Case ID is required' });
    }

    console.log('Received caseId:', caseId);

    // 1. Get the lawyer ID related to the case
    const getLawyerQuery = 'SELECT lawyer_id FROM case_lawyers WHERE case_id = ?';
    console.log('Executing query:', getLawyerQuery, 'with caseId:', caseId);
    const [lawyerResult] = await dbConnection().promise().query(getLawyerQuery, [caseId]);

    let lawyerId = null;
    if (lawyerResult.length > 0) {
       lawyerId = lawyerResult[0].lawyer_id;
      console.log('Lawyer ID for case:', lawyerId);

      // 2. Get Case Number
      const getCaseNumberQuery = 'SELECT case_number FROM cases WHERE id = ?';
        console.log('Executing query:', getCaseNumberQuery, 'with caseId:', caseId);
      const [caseNumberResult] = await dbConnection().promise().query(getCaseNumberQuery, [caseId]);
      let caseNumber = 'N/A';
       if (caseNumberResult.length > 0) {
        caseNumber = caseNumberResult[0].case_number;
        console.log('Case Number:', caseNumber);
    }
        // 3. Send notification to lawyer.
      const notificationMessage = `The case with number ${caseNumber} has been rejected by the admin.`;
      const addNotificationQuery =
        'INSERT INTO notifications (user_id, notification_type, message,is_read) VALUES (?, ?, ?, ?)';
      const [notificationResult] = await dbConnection()
        .promise()
        .query(addNotificationQuery, [lawyerId, 'Case', notificationMessage, 0]);

       console.log('Notification added successfully:', notificationResult.insertId);
    }

    // 4. Delete related records in case_lawyers
    const deleteCaseLawyersQuery = 'DELETE FROM case_lawyers WHERE case_id = ?';
    console.log('Executing query:', deleteCaseLawyersQuery, 'with caseId:', caseId);
    const [caseLawyersResult] = await dbConnection().promise().query(deleteCaseLawyersQuery, [caseId]);
    console.log('case_lawyers records deleted successfully:', caseLawyersResult.affectedRows);

    // 5. Delete related records in case_parties
    const deleteCasePartiesQuery = 'DELETE FROM case_parties WHERE case_id = ?';
    console.log('Executing query:', deleteCasePartiesQuery, 'with caseId:', caseId);
    const [casePartiesResult] = await dbConnection().promise().query(deleteCasePartiesQuery, [caseId]);
    console.log('case_parties records deleted successfully:', casePartiesResult.affectedRows);

    // 6. Delete the case record
    const deleteCaseQuery = 'DELETE FROM cases WHERE id = ?';
    console.log('Executing query:', deleteCaseQuery, 'with caseId:', caseId);
    const [caseResult] = await dbConnection().promise().query(deleteCaseQuery, [caseId]);

    if (caseResult.affectedRows === 0) {
      console.log('No rows affected, case not found or already deleted');
      return res.status(404).json({ message: 'Case record not found or already deleted' });
    }

    console.log('Case record deleted successfully');
    res.json({ message: 'Case record deleted successfully' });
  } catch (error) {
    console.error('Error deleting case record:', error);
    res.status(500).json({ message: 'Error deleting case record', error: error.message || error });
  }
});
router.delete('/delete-all-conversations', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const query = 'DELETE FROM conversations WHERE receiver_id = ?';
    const [result] = await dbConnection().promise().query(query, [userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'No conversations found for deletion' });
    }

    res.json({ message: 'All conversations deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting conversations', error: error.message || error });
  }
});

module.exports = router;
