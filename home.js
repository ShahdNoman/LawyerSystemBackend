const express = require('express');
const dbConnection = require('./dbconnection'); // Database connection
const verifyToken = require('./verifyToken'); // Token verification middleware
const router = express.Router();

// GET /home route with token verification
router.get('/home', verifyToken, (req, res) => {
  const db = dbConnection();
  const userId = req.user.id; // Extract user ID from the token

  console.log('User ID:', userId); // For debugging purposes

  const statsQuery = `
    SELECT 
      (SELECT COUNT(*) FROM cases WHERE case_status = 'Ongoing' AND (plaintiff_id = ? OR defendant_id = ? OR lawyer_id = ? OR judge_id = ?)) AS openCases,
      (SELECT COUNT(*) FROM cases WHERE case_status = 'Closed' AND (plaintiff_id = ? OR defendant_id = ? OR lawyer_id = ? OR judge_id = ?)) AS closedCases,
      (SELECT COUNT(*) FROM cases WHERE case_status = 'Execution' AND (plaintiff_id = ? OR defendant_id = ? OR lawyer_id = ? OR judge_id = ?)) AS executionCases
  `;

  const caseChartQuery = `
    SELECT case_type, COUNT(*) as count
    FROM cases
    WHERE plaintiff_id = ? OR defendant_id = ? OR lawyer_id = ? OR judge_id = ?
    GROUP BY case_type
  `;

  const recentCasesQuery = `
    SELECT * 
    FROM cases 
    WHERE plaintiff_id = ? OR defendant_id = ? OR lawyer_id = ? OR judge_id = ?
    ORDER BY id DESC 
    LIMIT 5
  `;

  // Execute the stats query
  db.query(statsQuery, [userId, userId, userId, userId, userId, userId, userId, userId, userId, userId, userId, userId], (err, statsResults) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }

    // Execute the case chart query
    db.query(caseChartQuery, [userId, userId, userId, userId], (err, caseChartResults) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          success: false,
          message: 'Internal server error',
        });
      }

      // Execute the recent cases query
      db.query(recentCasesQuery, [userId, userId, userId, userId], (err, recentCasesResults) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({
            success: false,
            message: 'Internal server error',
          });
        }

        // Prepare the case chart data
        const caseChart = {};
        caseChartResults.forEach(row => {
          caseChart[row.case_type] = row.count;
        });

        // Return the response with the stats, case chart, and recent cases
        return res.status(200).json({
          success: true,
          stats: {
            openCases: statsResults[0].openCases,
            closedCases: statsResults[0].closedCases,
            executionCases: statsResults[0].executionCases,
          },
          caseChart: caseChart,
          recentCases: recentCasesResults,
        });
      });
    });
  });
});
module.exports = router;
