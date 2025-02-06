// const express = require('express');
// const dbConnection = require('./dbconnection'); // Database connection
// const verifyToken = require('./verifyToken'); // Token verification middleware
// require('dotenv').config();
// const path = require('path'); // استيراد مكتبة path

// const router = express.Router();
// router.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // GET /home route with token verification
// router.get('/home', verifyToken, (req, res) => {
//   const db = dbConnection();
//   const userId = req.user.id; // Extract user ID from the token

//   console.log('User ID:', userId); // For debugging purposes

//   const statsQuery = `
//     SELECT 
//       (SELECT COUNT(*) FROM cases WHERE case_status = 'Ongoing' AND (plaintiff_id = ? OR defendant_id = ? OR lawyer_id = ? OR judge_id = ?)) AS openCases,
//       (SELECT COUNT(*) FROM cases WHERE case_status = 'Closed' AND (plaintiff_id = ? OR defendant_id = ? OR lawyer_id = ? OR judge_id = ?)) AS closedCases,
//       (SELECT COUNT(*) FROM cases WHERE case_status = 'Execution' AND (plaintiff_id = ? OR defendant_id = ? OR lawyer_id = ? OR judge_id = ?)) AS executionCases
//   `;

//   const caseChartQuery = `
//     SELECT case_type, COUNT(*) as count
//     FROM cases
//     WHERE plaintiff_id = ? OR defendant_id = ? OR lawyer_id = ? OR judge_id = ?
//     GROUP BY case_type
//   `;

//   const recentCasesQuery = `
//     SELECT * 
//     FROM cases 
//     WHERE plaintiff_id = ? OR defendant_id = ? OR lawyer_id = ? OR judge_id = ?
//     ORDER BY id DESC 
//     LIMIT 5
//   `;
//   // Execute the stats query
//   db.query(statsQuery, [userId, userId, userId, userId, userId, userId, userId, userId, userId, userId, userId, userId], (err, statsResults) => {
//     if (err) {
//       console.error('Database error:', err);
//       return res.status(500).json({
//         success: false,
//         message: 'Internal server error',
//       });
//     }
//     // Execute the case chart query
//     db.query(caseChartQuery, [userId, userId, userId, userId], (err, caseChartResults) => {
//       if (err) {
//         console.error('Database error:', err);
//         return res.status(500).json({
//           success: false,
//           message: 'Internal server error',
//         });
//       }

//       // Execute the recent cases query
//       db.query(recentCasesQuery, [userId, userId, userId, userId], (err, recentCasesResults) => {
//         if (err) {
//           console.error('Database error:', err);
//           return res.status(500).json({
//             success: false,
//             message: 'Internal server error',
//           });
//         }

//         // Prepare the case chart data
//         const caseChart = {};
//         caseChartResults.forEach(row => {
//           caseChart[row.case_type] = row.count;
//         });

//         // Return the response with the stats, case chart, and recent cases
//         return res.status(200).json({
//           success: true,
//           stats: {
//             openCases: statsResults[0].openCases,
//             closedCases: statsResults[0].closedCases,
//             executionCases: statsResults[0].executionCases,
//           },
//           caseChart: caseChart,
//           recentCases: recentCasesResults,
//         });
//       });
//     });
//   });
// });

const express = require('express');
const dbConnection = require('./dbconnection'); // Database connection
const verifyToken = require('./verifyToken'); // Token verification middleware
require('dotenv').config();
const path = require('path'); // استيراد مكتبة path

const router = express.Router();
router.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // GET /home route with token verification
// router.get('/home', verifyToken, (req, res) => {
//   const db = dbConnection();
//   const userId = req.user.id; // Extract user ID from the token

//   console.log('User ID:', userId); // For debugging purposes

//   const statsQuery = `
//     SELECT 
//       (SELECT COUNT(*) FROM cases WHERE case_status = 'Ongoing' AND accepted = 1 AND  EXISTS (SELECT 1 FROM case_lawyers cl WHERE cl.case_id = cases.id AND cl.lawyer_id = ?)) AS openCases,
//       (SELECT COUNT(*) FROM cases WHERE case_status = 'Closed' AND accepted = 1 AND EXISTS (SELECT 1 FROM case_lawyers cl WHERE cl.case_id = cases.id AND cl.lawyer_id = ?)) AS closedCases,
//       (SELECT COUNT(*) FROM cases WHERE case_status = 'Execution' AND accepted = 1  AND EXISTS (SELECT 1 FROM case_lawyers cl WHERE cl.case_id = cases.id AND cl.lawyer_id = ?)) AS executionCases
//   `;

//   const caseChartQuery = `
//     SELECT c.case_type, COUNT(c.id) as count
//     FROM cases c
//     WHERE EXISTS (SELECT 1 FROM case_lawyers cl WHERE cl.case_id = c.id AND cl.lawyer_id = ? AND c.accepted = 1)
//     GROUP BY c.case_type
//   `;

//   const recentCasesQuery = `
//     SELECT c.*
//     FROM cases c
//     WHERE EXISTS (SELECT 1 FROM case_lawyers cl WHERE cl.case_id = c.id AND cl.lawyer_id = ? AND c.accepted = 1)
//     ORDER BY c.id DESC 
//     LIMIT 5
//   `;
//     // Execute the stats query
//     db.query(statsQuery, [userId,userId, userId], (err, statsResults) => {
//         if (err) {
//           console.error('Database error:', err);
//           return res.status(500).json({
//             success: false,
//             message: 'Internal server error',
//           });
//         }
//       // Execute the case chart query
//       db.query(caseChartQuery, [userId], (err, caseChartResults) => {
//         if (err) {
//           console.error('Database error:', err);
//           return res.status(500).json({
//             success: false,
//             message: 'Internal server error',
//           });
//         }

//         // Execute the recent cases query
//         db.query(recentCasesQuery, [userId], (err, recentCasesResults) => {
//           if (err) {
//             console.error('Database error:', err);
//             return res.status(500).json({
//               success: false,
//               message: 'Internal server error',
//             });
//           }

//           // Prepare the case chart data
//           const caseChart = {};
//           caseChartResults.forEach(row => {
//             caseChart[row.case_type] = row.count;
//           });

//           // Return the response with the stats, case chart, and recent cases
//           return res.status(200).json({
//             success: true,
//             stats: {
//               openCases: statsResults[0].openCases,
//               closedCases: statsResults[0].closedCases,
//               executionCases: statsResults[0].executionCases,
//             },
//             caseChart: caseChart,
//             recentCases: recentCasesResults,
//           });
//         });
//       });
//     });
//   });
router.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// GET /home route with token verification
router.get('/home', verifyToken, async (req, res) => {
  const db = dbConnection();
  const userId = req.user.id; // Extract user ID from the token
  const userRole = req.user.role; // Extract user role from the token

  console.log('User ID:', userId, 'User Role:', userRole); // For debugging purposes

  let statsQuery, caseChartQuery, recentCasesQuery, queryParams;

    switch (userRole) {
        case 'Lawyer':
             statsQuery = `
                SELECT 
                  (SELECT COUNT(*) FROM cases WHERE case_status = 'Ongoing' AND accepted = 1 AND  EXISTS (SELECT 1 FROM case_lawyers cl WHERE cl.case_id = cases.id AND cl.lawyer_id = ?)) AS openCases,
                  (SELECT COUNT(*) FROM cases WHERE case_status = 'Closed' AND accepted = 1 AND EXISTS (SELECT 1 FROM case_lawyers cl WHERE cl.case_id = cases.id AND cl.lawyer_id = ?)) AS closedCases,
                  (SELECT COUNT(*) FROM cases WHERE case_status = 'Execution' AND accepted = 1  AND EXISTS (SELECT 1 FROM case_lawyers cl WHERE cl.case_id = cases.id AND cl.lawyer_id = ?)) AS executionCases
              `;
             caseChartQuery = `
                 SELECT c.case_type, COUNT(c.id) as count
                  FROM cases c
                  WHERE EXISTS (SELECT 1 FROM case_lawyers cl WHERE cl.case_id = c.id AND cl.lawyer_id = ? AND c.accepted = 1)
                 GROUP BY c.case_type
                `;
            recentCasesQuery = `
                 SELECT c.*
                 FROM cases c
                  WHERE EXISTS (SELECT 1 FROM case_lawyers cl WHERE cl.case_id = c.id AND cl.lawyer_id = ? AND c.accepted = 1)
                 ORDER BY c.id DESC 
                LIMIT 5
                 `;
            queryParams = [userId, userId, userId];
            break;
        case 'Citizen':
            statsQuery = `
                SELECT 
                (SELECT COUNT(*) FROM cases WHERE case_status = 'Ongoing' AND accepted = 1 AND  EXISTS (SELECT 1 FROM case_parties cp WHERE cp.case_id = cases.id AND cp.user_id = ?)) AS openCases,
                  (SELECT COUNT(*) FROM cases WHERE case_status = 'Closed' AND accepted = 1 AND EXISTS (SELECT 1 FROM case_parties cp WHERE cp.case_id = cases.id AND cp.user_id = ?)) AS closedCases,
                  (SELECT COUNT(*) FROM cases WHERE case_status = 'Execution' AND accepted = 1  AND EXISTS (SELECT 1 FROM case_parties cp WHERE cp.case_id = cases.id AND cp.user_id = ?)) AS executionCases
              `;
               caseChartQuery = `
                 SELECT c.case_type, COUNT(c.id) as count
                  FROM cases c
                  WHERE EXISTS (SELECT 1 FROM case_parties cp WHERE cp.case_id = c.id AND cp.user_id = ? AND c.accepted = 1)
                 GROUP BY c.case_type
                `;
            recentCasesQuery = `
                 SELECT c.*
                 FROM cases c
                  WHERE EXISTS (SELECT 1 FROM case_parties cp WHERE cp.case_id = c.id AND cp.user_id = ? AND c.accepted = 1)
                 ORDER BY c.id DESC 
                LIMIT 5
                 `;
            queryParams = [userId,userId, userId];
            break;
        case 'Judge':
            statsQuery = `
                SELECT 
                (SELECT COUNT(*) FROM cases WHERE case_status = 'Ongoing' AND accepted = 1 AND  judge_id = ?) AS openCases,
                  (SELECT COUNT(*) FROM cases WHERE case_status = 'Closed' AND accepted = 1 AND judge_id = ?) AS closedCases,
                  (SELECT COUNT(*) FROM cases WHERE case_status = 'Execution' AND accepted = 1  AND judge_id = ?) AS executionCases
              `;
            caseChartQuery = `
               SELECT c.case_type, COUNT(c.id) as count
               FROM cases c
               WHERE c.judge_id = ? AND c.accepted = 1
               GROUP BY c.case_type
            `;
            recentCasesQuery = `
               SELECT c.*
                 FROM cases c
                 WHERE c.judge_id = ? AND c.accepted = 1
                ORDER BY c.id DESC
                 LIMIT 5
               `;
            queryParams = [userId, userId, userId];
             break;
        default:
            return res.status(400).json({ success: false, message: 'Invalid user role' });
    }
    try {
      const [statsResults] = await db.promise().query(statsQuery, queryParams);
      const [caseChartResults] = await db.promise().query(caseChartQuery, [userId]);
      const [recentCasesResults] = await db.promise().query(recentCasesQuery, [userId]);

      const caseChart = {};
      caseChartResults.forEach(row => {
          caseChart[row.case_type] = row.count;
        });
      return res.status(200).json({
        success: true,
        stats: {
          openCases: statsResults[0]?.openCases || 0,
          closedCases: statsResults[0]?.closedCases || 0,
          executionCases: statsResults[0]?.executionCases || 0,
      },
      caseChart: caseChart,
      recentCases: recentCasesResults,
    });

  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

router.get('/get-my-info', verifyToken, async (req, res) => {
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
        password:userData.password,
        profilePic:`http://10.0.2.2:4000${userData.profile_picture}`, // Assuming 'profile_pic' is the path or URL to the profile image
      }
    });
  } catch (error) {
    console.error('Error retrieving user:', error);
    res.status(500).json({ message: 'Error retrieving user information', error: error.message || error });
  }
});
module.exports = router;
