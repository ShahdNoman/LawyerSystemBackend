
const express = require('express');
const dbConnection = require('./dbconnection');
const verifyToken = require('./verifyToken');
const moment = require('moment-timezone'); // مكتبة لتنسيق التواريخ مع المنطقة الزمنية
require('dotenv').config();

const router = express.Router();
const serverBaseUrl = 'http://10.0.2.2:4000';
const TIMEZONE = 'Africa/Gaza'; // تحديد المنطقة الزمنية

// Function to format session data
const formatSessions = (sessionsResults) => {
    return sessionsResults.map(session => ({
        id: session.id,
        session_date: moment.tz(session.session_date, TIMEZONE).format('YYYY-MM-DD HH:mm:ss'),
        session_details: session.session_details,
        session_status: session.session_status,
        next_session_date: session.next_session_date
            ? moment.tz(session.next_session_date, TIMEZONE).format('YYYY-MM-DD HH:mm:ss')
            : null,
        case_number: session.case_number,
        court_name: session.court_name,
        case_type: session.case_type,
        court_type: session.court_type,
    }));
};
const executeQuery = async (db, query, params) => {
    return new Promise((resolve, reject) => {
        db.query(query, params, (err, results) => {
            if (err) {
                console.error('Database query error:', err);
                return reject(err);
            }
             resolve(results);
        });
    });
};

// Route to fetch sessions for a specific date
router.get('/sessions/bydate', verifyToken, async (req, res) => {
    const db = dbConnection();
    const userId = req.user.id;
    const userRole = req.user.role;
    const requestedDate = req.query.date;

    console.log('User ID from token:', userId, 'User Role:', userRole, 'Requested date:', requestedDate);

    if (!requestedDate) {
        return res.status(400).json({ success: false, message: 'Date is required' });
    }

    const adjustedDate = moment.tz(requestedDate, TIMEZONE).format('YYYY-MM-DD');
    console.log('Adjusted date for query:', adjustedDate);

    let sessionsQuery, queryParams;
    try {
        switch (userRole) {
            case 'Lawyer':
                sessionsQuery = `
                    SELECT s.id, s.session_date, s.session_details, s.session_status, s.next_session_date, 
                           c.case_number, c.court_name, c.case_type, c.court_type
                    FROM sessions s
                    JOIN cases c ON s.case_id = c.id
                    JOIN case_lawyers cl ON cl.case_id = c.id
                    WHERE DATE(s.session_date) = ? 
                      AND cl.lawyer_id = ? 
                    ORDER BY s.session_date ASC
                `;
                queryParams = [adjustedDate, userId];
                break;
            case 'Citizen':
                sessionsQuery = `
                    SELECT s.id, s.session_date, s.session_details, s.session_status, s.next_session_date,
                        c.case_number, c.court_name, c.case_type, c.court_type
                    FROM sessions s
                    JOIN cases c ON s.case_id = c.id
                    JOIN case_parties cp ON cp.case_id = c.id
                    WHERE DATE(s.session_date) = ?
                      AND cp.user_id = ?
                    ORDER BY s.session_date ASC
                `;
                queryParams = [adjustedDate, userId];
                break;
            case 'Judge':
                sessionsQuery = `
                   SELECT s.id, s.session_date, s.session_details, s.session_status, s.next_session_date,
                        c.case_number, c.court_name, c.case_type, c.court_type
                    FROM sessions s
                    JOIN cases c ON s.case_id = c.id
                    WHERE DATE(s.session_date) = ?
                      AND c.judge_id = ?
                    ORDER BY s.session_date ASC
                `;
                 queryParams = [adjustedDate, userId];
                break;
            default:
                return res.status(400).json({ success: false, message: 'Invalid user role' });
        }
         const sessionsResults =  await executeQuery(db,sessionsQuery, queryParams)
            const sessions = formatSessions(sessionsResults);
            return res.status(200).json({ success: true, sessions: sessions });
    } catch (error) {
        console.error('Error while fetching sessions by date:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Route to fetch sessions based on court, record type, and case number
router.get('/sessions/byfile', verifyToken, async (req, res) => {
    const db = dbConnection();
    const userId = req.user.id;
    const userRole = req.user.role;
    const { court: courtName, recordType, caseNumber, caseYear } = req.query;

    console.log('User ID from token:', userId, 'User Role:', userRole, 'Received query params:', { courtName, recordType, caseNumber, caseYear });

    if (!courtName || !recordType || !caseNumber || !caseYear) {
         return res.status(400).json({
             success: false,
             message: 'All court, record type, case number, and case year are required',
         });
     }
    let sessionsQuery, queryParams;
      try {
         switch (userRole) {
             case 'Lawyer':
                 sessionsQuery = `
                       SELECT s.id, s.session_date, s.session_details, s.session_status, s.next_session_date,
                            c.case_number, c.court_name, c.case_type, c.court_type
                        FROM sessions s
                        JOIN cases c ON s.case_id = c.id
                        JOIN case_lawyers cl ON cl.case_id = c.id
                        WHERE LOWER(c.court_name) = LOWER(?)
                          AND LOWER(c.case_type) = LOWER(?)
                            AND c.case_number = ?
                            AND YEAR(c.date_of_roses) = ?
                           AND cl.lawyer_id = ?
                        ORDER BY s.session_date ASC
                  `;
                 queryParams = [courtName, recordType, caseNumber, caseYear, userId];
                 break;
            case 'Citizen':
                sessionsQuery = `
                      SELECT s.id, s.session_date, s.session_details, s.session_status, s.next_session_date,
                            c.case_number, c.court_name, c.case_type, c.court_type
                         FROM sessions s
                           JOIN cases c ON s.case_id = c.id
                          JOIN case_parties cp ON cp.case_id = c.id
                        WHERE LOWER(c.court_name) = LOWER(?)
                            AND LOWER(c.case_type) = LOWER(?)
                            AND c.case_number = ?
                            AND YEAR(c.date_of_roses) = ?
                            AND cp.user_id = ?
                           ORDER BY s.session_date ASC
                 `;
                  queryParams = [courtName, recordType, caseNumber, caseYear, userId];
                break;
            case 'Judge':
                sessionsQuery = `
                    SELECT s.id, s.session_date, s.session_details, s.session_status, s.next_session_date,
                          c.case_number, c.court_name, c.case_type, c.court_type
                      FROM sessions s
                        JOIN cases c ON s.case_id = c.id
                     WHERE LOWER(c.court_name) = LOWER(?)
                         AND LOWER(c.case_type) = LOWER(?)
                          AND c.case_number = ?
                           AND YEAR(c.date_of_roses) = ?
                          AND c.judge_id = ?
                    ORDER BY s.session_date ASC
                 `;
                queryParams = [courtName, recordType, caseNumber, caseYear, userId];
                break;
           default:
                  return res.status(400).json({ success: false, message: 'Invalid user role' });
        }
         const sessionsResults =  await executeQuery(db,sessionsQuery, queryParams)
          const sessions = formatSessions(sessionsResults);
            return res.status(200).json({ success: true, sessions: sessions });
     } catch (error) {
         console.error('Error while fetching sessions by file:', error);
         return res.status(500).json({ success: false, message: 'Internal server error' });
     }
});

module.exports = router;
// // Route to fetch sessions for a specific date
// router.get('/sessions/bydate', verifyToken, async (req, res) => {
//     const db = dbConnection();
//     const userId = req.user.id; // استخراج ID المستخدم من التوكن
//     console.log('User ID from token:', userId);

//     const requestedDate = req.query.date;
//     console.log('Requested date:', requestedDate);

//     if (!requestedDate) {
//         console.log('Error: Date is missing');
//         return res.status(400).json({
//             success: false,
//             message: 'Date is required',
//         });
//     }

//     // تحويل التاريخ إلى المنطقة الزمنية المناسبة
//     const adjustedDate = moment.tz(requestedDate, TIMEZONE).format('YYYY-MM-DD');
//     console.log('Adjusted date for query:', adjustedDate);

//     try {
//         const sessionsQuery = `
//             SELECT s.id, s.session_date, s.session_details, s.session_status, s.next_session_date, 
//                    c.case_number, c.court_name, c.case_type, c.court_type
//             FROM sessions s
//             JOIN cases c ON s.case_id = c.id
//             JOIN case_lawyers cl ON cl.case_id = c.id
//             WHERE DATE(s.session_date) = ? 
//               AND cl.lawyer_id = ? 
//             ORDER BY s.session_date ASC
//         `;

//         console.log('Executing query for sessions by date...');
//         const sessionsResults = await new Promise((resolve, reject) => {
//             db.query(sessionsQuery, [adjustedDate, userId], (err, results) => {
//                 if (err) {
//                     console.error('Database query error:', err);
//                     return reject(err);
//                 }
//                 console.log('Query results:', results);
//                 resolve(results);
//             });
//         });

//         const sessions = sessionsResults.map(session => ({
//             id: session.id,
//             session_date: moment.tz(session.session_date, TIMEZONE).format('YYYY-MM-DD HH:mm:ss'),
//             session_details: session.session_details,
//             session_status: session.session_status,
//             next_session_date: session.next_session_date 
//                 ? moment.tz(session.next_session_date, TIMEZONE).format('YYYY-MM-DD HH:mm:ss') 
//                 : null,
//             case_number: session.case_number,
//             court_name: session.court_name,
//             case_type: session.case_type,
//             court_type: session.court_type,
//         }));

//         console.log('Formatted sessions:', sessions);
//         return res.status(200).json({
//             success: true,
//             sessions: sessions,
//         });
//     } catch (error) {
//         console.error('Error while fetching sessions by date:', error);
//         return res.status(500).json({
//             success: false,
//             message: 'Internal server error',
//         });
//     }
// });

// // Route to fetch sessions based on court, record type, and case number
// router.get('/sessions/byfile', verifyToken, async (req, res) => {
//     const db = dbConnection();
//     const userId = req.user.id; // استخراج ID المستخدم من التوكن
//     console.log('User ID from token:', userId);

//     const { court: courtName, recordType, caseNumber, caseYear } = req.query;
//     console.log('Received query params:', { courtName, recordType, caseNumber, caseYear });

//     if (!courtName || !recordType || !caseNumber || !caseYear) {
//         console.log('Error: Missing one or more required parameters');
//         return res.status(400).json({
//             success: false,
//             message: 'All court, record type, case number, and case year are required',
//         });
//     }

//     try {
//         const sessionsQuery = `
//             SELECT s.id, s.session_date, s.session_details, s.session_status, s.next_session_date,
//                    c.case_number, c.court_name, c.case_type, c.court_type
//             FROM sessions s
//             JOIN cases c ON s.case_id = c.id
//             JOIN case_lawyers cl ON cl.case_id = c.id
//             WHERE LOWER(c.court_name) = LOWER(?)
//               AND LOWER(c.case_type) = LOWER(?)
//               AND c.case_number = ?
//               AND YEAR(c.date_of_roses) = ?
//               AND cl.lawyer_id = ? 
//             ORDER BY s.session_date ASC
//         `;

//         console.log('Executing query for sessions by file...');
//         const sessionsResults = await new Promise((resolve, reject) => {
//             db.query(sessionsQuery, [courtName, recordType, caseNumber, caseYear, userId], (err, results) => {
//                 if (err) {
//                     console.error('Database query error:', err);
//                     return reject(err);
//                 }
//                 console.log('Query results:', results);
//                 resolve(results);
//             });
//         });

//         const sessions = sessionsResults.map(session => ({
//             id: session.id,
//             session_date: moment.tz(session.session_date, TIMEZONE).format('YYYY-MM-DD HH:mm:ss'),
//             session_details: session.session_details,
//             session_status: session.session_status,
//             next_session_date: session.next_session_date 
//                 ? moment.tz(session.next_session_date, TIMEZONE).format('YYYY-MM-DD HH:mm:ss') 
//                 : null,
//             case_number: session.case_number,
//             court_name: session.court_name,
//             case_type: session.case_type,
//             court_type: session.court_type,
//         }));

//         console.log('Formatted sessions:', sessions);
//         return res.status(200).json({
//             success: true,
//             sessions: sessions,
//         });
//     } catch (error) {
//         console.error('Error while fetching sessions by file:', error);
//         return res.status(500).json({
//             success: false,
//             message: 'Internal server error',
//         });
//     }
// });

// // Route to create a new session
// router.post('/create-session', verifyToken, async (req, res) => {
//     const db = dbConnection();
//     const { case_id, sessionDetails, sessionDate, sessionStatus } = req.body;

//     if (!case_id || !sessionDetails || !sessionDate || !sessionStatus) {
//         return res.status(400).json({
//             success: false,
//             message: 'All fields are required',
//         });
//     }

//     try {
//         // Convert date to the specified timezone
//         const adjustedSessionDate = moment.tz(sessionDate, 'UTC').tz(TIMEZONE);
//         const formattedSessionDate = adjustedSessionDate.format('YYYY-MM-DD HH:mm:ss');

//         const newSession = {
//             case_id: case_id,
//             session_date: formattedSessionDate,
//             session_details: sessionDetails,
//             session_status: sessionStatus,
//         };

//         const sql = 'INSERT INTO sessions SET ?';

//         db.query(sql, newSession, async (err, result) => {
//             if (err) {
//                 console.error('Error inserting new session:', err);
//                 return res.status(500).json({
//                     success: false,
//                     message: 'Failed to create session',
//                     error: err.message,
//                 });
//             }

//               // Fetch case and its related users
//            const caseDetails = await new Promise((resolve, reject) => {
//                 const query = `
//                         SELECT c.case_number,
//                            u.id as user_id
//                         FROM cases c
//                         JOIN case_parties cp ON c.id = cp.case_id
//                         JOIN users u on u.id = cp.user_id
//                         where c.id = ?
//                            UNION
//                         SELECT c.case_number,
//                            u.id as user_id
//                         FROM cases c
//                         JOIN case_lawyers cl ON c.id = cl.case_id
//                         JOIN users u on u.id = cl.lawyer_id
//                         where c.id = ?
//                     `;
//                 db.query(query, [case_id, case_id], (err, results) => {
//                     if (err) {
//                         console.error('Error fetching case details and users:', err);
//                         return reject(err);
//                     }
//                      resolve(results);
//                  });
//             });
//              const case_number = caseDetails[0].case_number;


//         // Create notifications for all users in the case
//          const notificationPromises = caseDetails.map(row => {
//               const message = `A new session has been scheduled for case #${case_number} on ${moment.tz(formattedSessionDate,TIMEZONE).format('YYYY-MM-DD HH:mm:ss')}`;
//               return new Promise((resolve, reject) => {
//                db.query(
//                         'INSERT INTO notifications (user_id, notification_type, message) VALUES (?, ?, ?)',
//                         [row.user_id, 'Session', message],
//                         (err, results) => {
//                             if (err) {
//                                 console.error('Error inserting notifications:', err);
//                                 return reject(err);
//                             }
//                             resolve(results);
//                         }
//                     );
//               });
//             });
//            await Promise.all(notificationPromises);

//             res.status(201).json({
//                 success: true,
//                 message: 'Session created successfully!',
//                 session: newSession,
//             });
//         });
//     } catch (error) {
//         console.error('Error creating session:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Failed to create session',
//             error: error.message,
//         });
//     }
// });

router.post('/create-session', verifyToken, async (req, res) => {
  const db = dbConnection();
  const { case_id, sessionDetails, sessionDate, sessionStatus } = req.body;

  if (!case_id || !sessionDetails || !sessionDate || !sessionStatus) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required',
    });
  }

  try {
      // Convert date to the specified timezone
      const adjustedSessionDate = moment.tz(sessionDate, 'UTC').tz(TIMEZONE);
      const formattedSessionDate = adjustedSessionDate.format('YYYY-MM-DD HH:mm:ss');

    const newSession = {
      case_id: case_id,
      session_date: formattedSessionDate,
      session_details: sessionDetails,
      session_status: sessionStatus,
    };

    const sql = 'INSERT INTO sessions SET ?';

    db.query(sql, newSession, async (err, result) => {
      if (err) {
        console.error('Error inserting new session:', err);
        return res.status(500).json({
          success: false,
          message: 'Failed to create session',
          error: err.message,
        });
      }

      // Fetch case details including judge id and related users
      const caseDetails = await new Promise((resolve, reject) => {
         const query = `
                        SELECT c.case_number,
                               c.judge_id,
                               u.id as user_id
                        FROM cases c
                        JOIN case_parties cp ON c.id = cp.case_id
                        JOIN users u on u.id = cp.user_id
                        where c.id = ?
                           UNION
                        SELECT c.case_number,
                               c.judge_id,
                               u.id as user_id
                        FROM cases c
                        JOIN case_lawyers cl ON c.id = cl.case_id
                        JOIN users u on u.id = cl.lawyer_id
                        where c.id = ?
                        UNION
                        SELECT c.case_number,
                               c.judge_id,
                              c.judge_id as user_id
                        FROM cases c
                        where c.id = ?
                    `;
        db.query(query, [case_id, case_id, case_id], (err, results) => {
          if (err) {
            console.error('Error fetching case details and users:', err);
            return reject(err);
          }
          resolve(results);
        });
      });
      const case_number = caseDetails[0].case_number;
        const judge_id = caseDetails[0].judge_id;
           // Create notifications for all users in the case
      const notificationPromises = caseDetails.map(row => {
         const message = `A new session has been scheduled for case #${case_number} on ${moment.tz(formattedSessionDate,TIMEZONE).format('YYYY-MM-DD HH:mm:ss')}`;
           return new Promise((resolve, reject) => {
              db.query(
                  'INSERT INTO notifications (user_id, notification_type, message) VALUES (?, ?, ?)',
                   [row.user_id, 'Session', message],
                     (err, results) => {
                         if (err) {
                             console.error('Error inserting notifications:', err);
                             return reject(err);
                           }
                        resolve(results);
                      }
                    );
               });
            });
          await Promise.all(notificationPromises);

         if (judge_id) {
              const messageForJudge = `A new session has been scheduled for case #${case_number} on ${moment.tz(formattedSessionDate,TIMEZONE).format('YYYY-MM-DD HH:mm:ss')}`;

           await new Promise((resolve, reject) => {
              db.query(
                  'INSERT INTO notifications (user_id, notification_type, message) VALUES (?, ?, ?)',
                  [judge_id, 'Session', messageForJudge],
                    (err, results) => {
                        if (err) {
                            console.error('Error inserting judge notifications:', err);
                            return reject(err);
                        }
                       resolve(results);
                      }
                    );
             });
            }

        res.status(201).json({
                success: true,
                message: 'Session created successfully!',
                 session: newSession,
            });

        });
        } catch (error) {
          console.error('Error creating session:', error);
          res.status(500).json({
              success: false,
                message: 'Failed to create session',
                error: error.message,
            });
        }
      });

module.exports = router;

