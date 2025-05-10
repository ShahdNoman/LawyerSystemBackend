
const express = require('express');
const verifyToken = require('./verifyToken'); // Token verification middleware
const dbConnection = require('./dbconnection'); // الاتصال بقاعدة البيانات
const moment = require('moment-timezone'); // إضافة moment-timezone
const router = express.Router();

router.get('/calender', verifyToken, async (req, res) => {
  const db = dbConnection();
  const userId = req.user.id;
  const userRole = req.user.role; // استخراج الدور من التوكن
  console.log('User ID:', userId);
  console.log('User Role:', userRole);

  let query;
  let params;

  switch (userRole) {
    case 'Lawyer':
      query = `
        SELECT 
          s.id, 
          s.case_id, 
          s.session_date, 
          s.session_details, 
          s.session_status, 
          s.next_session_date,
          c.case_number
      FROM sessions s
      JOIN cases c ON s.case_id = c.id
      JOIN case_lawyers cl ON c.id=cl.case_id
      WHERE cl.lawyer_id = ?
      ORDER BY s.session_date;
      `;
      params = [userId];
      break;
    case 'Citizen':
        query = `
        SELECT 
          s.id, 
          s.case_id, 
          s.session_date, 
          s.session_details, 
          s.session_status, 
          s.next_session_date,
          c.case_number
        FROM sessions s
        JOIN cases c ON s.case_id = c.id
        JOIN case_parties cp ON c.id = cp.case_id
        WHERE cp.user_id = ?
        ORDER BY s.session_date;
        `;
        params = [userId];
        break;
    case 'Judge':
      query = `
        SELECT 
          s.id, 
          s.case_id, 
          s.session_date, 
          s.session_details, 
          s.session_status, 
          s.next_session_date,
          c.case_number
        FROM sessions s
        JOIN cases c ON s.case_id = c.id
        WHERE c.judge_id = ?
        ORDER BY s.session_date;
      `;
      params = [userId];
      break;
    default:
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access.',
      });
  }

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Error fetching sessions:', err);
      return res
        .status(500)
        .json({ success: false, message: 'Failed to retrieve sessions', error: err.message });
    }

    const formattedSessions = results.flatMap((session) => {
      const events = [];
      const currentDate = new Date();
        const sessionDate = session.session_date ? moment(session.session_date).tz('Africa/Gaza').format('YYYY-MM-DD HH:mm:ss') : null;


            if(sessionDate){
            events.push({
            date: sessionDate,
            details: session.session_details,
            status: session.session_status,
            type: 'past',
           });
         }
      if (session.next_session_date) {
            const nextSessionDate = moment(session.next_session_date).tz('Africa/Gaza').format('YYYY-MM-DD HH:mm:ss');
            const isFutureSession = moment(nextSessionDate).isAfter(currentDate);
        
          if (isFutureSession) {
                events.push({
                   date: nextSessionDate,
                   details: 'جلسة مستقبلية',
                   status: 'pending',
                   type: 'future',
              });
             }
         }
        return events;
    });
    res.status(200).json(formattedSessions);
  });
});
 module.exports = router;
