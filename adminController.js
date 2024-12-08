const express = require('express');
const dbConnection = require('./dbconnection');
const verifyToken = require('./verifyToken'); 
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



router.post('/create-admin', verifyToken, async (req, res) => {
  const { username, password, email, phone_number, full_name, status } = req.body;

  // Check for missing required fields
  if (!username || !password || !email || !phone_number || !full_name) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Default value for status if not provided
  const userStatus = status || 'Active';

  try {
    // Insert query to add the user
    const query = `
      INSERT INTO users (username, password, role, email, phone_number, full_name, status)
      VALUES (?, ?, 'Admin', ?, ?, ?, ?)
    `;

    // Execute the query
    const [result] = await dbConnection().promise().query(query, [username, password, email, phone_number, full_name, userStatus]);

    res.status(201).json({ message: 'Admin user created successfully', userId: result.insertId });
  } catch (error) {
    console.error('Error creating admin user:', error);
    res.status(500).json({ message: 'Error creating admin user', error: error.message || error });
  }
});


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


router.post('/add-complaint', verifyToken, async (req, res) => {
  try {
    const { case_id, complaint_type, complaint_details, complainant_id, accused_id, complaint_status } = req.body;

    if (!case_id || !complaint_type || !complaint_details || !complainant_id || !accused_id || !complaint_status) {
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








////////////////////////////////
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
  try {
    const query = 'SELECT * FROM conversations';
    console.log('Executing query:', query);  
    const [result] = await dbConnection().promise().query(query);
        if (!result || result.length === 0) {
      return res.status(404).json({ message: 'No conversations found' });
    }

    res.json(result);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ message: 'Error fetching conversations', error: error.message || error });
  }
});
router.get('/viewAll-notifications', verifyToken, async (req, res) => {
  try {
    const query = 'SELECT * FROM notifications';
    console.log('Executing query:', query);  
    const [result] = await dbConnection().promise().query(query);
        if (!result || result.length === 0) {
      return res.status(404).json({ message: 'No notifications found' });
    }

    res.json(result);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Error fetching notifications', error: error.message || error });
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

router.delete('/adminRoutes/delete-user/:userId', verifyToken, async (req, res) => {
  const { userId } = req.params; // Extract the userId from the request parameters

  try {
    const query = 'DELETE FROM users WHERE id = ?';
    console.log('Executing query:', query, 'with userId:', userId); 

    const [result] = await dbConnection().promise().query(query, [userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found or already deleted' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user', error: error.message || error });
  }
});

router.delete('/notifications/:id', verifyToken, async (req, res) => {
  const { id } = req.params; 

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
router.delete('/adminRoutes/delete-attachment/:attachmentId', verifyToken, async (req, res) => {
  const { attachmentId } = req.params; // Extract the attachmentId from the request parameters

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
router.delete('/adminRoutes/delete-conversation/:conversationId', verifyToken, async (req, res) => {
  const { conversationId } = req.params; // Extract the conversationId from the request parameters

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

router.delete('/adminRoutes/delete-payment/:paymentId', verifyToken, async (req, res) => {
  const { paymentId } = req.params; // Extract the paymentId from the request parameters

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
router.delete('/adminRoutes/delete-session/:sessionId', verifyToken, async (req, res) => {
  const { sessionId } = req.params; // Extract the sessionId from the request parameters

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

router.delete('/adminRoutes/delete-complaint/:complaintId', verifyToken, async (req, res) => {
  const { complaintId } = req.params; // Extract the complaintId from the request parameters

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
router.delete('/adminRoutes/delete-case/:caseId', verifyToken, async (req, res) => {
  const { caseId } = req.params; // Extract the caseId from the request parameters

  try {
    // SQL query to delete a case record by its ID
    const query = 'DELETE FROM cases WHERE id = ?';
    console.log('Executing query:', query, 'with caseId:', caseId); // Log query execution for debugging

    const [result] = await dbConnection().promise().query(query, [caseId]);

    // Check if any row was affected
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Case record not found or already deleted' });
    }

    // Return a success message
    res.json({ message: 'Case record deleted successfully' });
  } catch (error) {
    // Handle errors during the delete operation
    console.error('Error deleting case record:', error);
    res.status(500).json({ message: 'Error deleting case record', error: error.message || error });
  }
});

module.exports = router;