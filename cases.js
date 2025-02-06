
const express = require('express');
const dbConnection = require('./dbconnection');
const verifyToken = require('./verifyToken');
require('dotenv').config();
const path = require('path');

const router = express.Router();
router.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// // Route to fetch all cases related to the logged-in user
// router.get('/cases', verifyToken, async (req, res) => {
//     const db = dbConnection();
//     const userId = req.user.id;
//     const serverBaseUrl = 'http://10.0.2.2:4000'; // قاعدة العنوان URL الخاص بالخادم

//     try {
//         // Fetch cases related to the logged-in user as a lawyer
//         const lawyerCasesQuery = `
//         SELECT c.*
//         FROM cases c
//         JOIN case_lawyers cl ON c.id = cl.case_id
//         WHERE cl.lawyer_id = ? AND c.accepted = 1
//         `;

//         const lawyerCasesResults = await new Promise((resolve, reject) => {
//             db.query(lawyerCasesQuery, [userId], (err, results) => {
//                 if (err) {
//                     return reject(err);
//                 }
//                 resolve(results);
//             });
//         });
//         // Prepare an array to hold all cases with detailed information
//         const allCasesWithDetails = await Promise.all(lawyerCasesResults.map(async (caseItem) => {

//             // Fetch all parties information from case_parties
//             const partiesQuery = `
//                 SELECT cp.party_type, u.id AS user_id, u.full_name, u.id_number
//                 FROM case_parties cp
//                 JOIN users u ON cp.user_id = u.id
//                 WHERE cp.case_id = ?
//             `;
//             const partiesResults = await new Promise((resolve, reject) => {
//                 db.query(partiesQuery, [caseItem.id], (err, results) => {
//                     if (err) {
//                         return reject(err);
//                     }
//                     resolve(results);
//                 });
//             });
//             // Fetch lawyers for all parties
//             const lawyersQuery = `
//             SELECT cl.party_type, u.id AS lawyer_id, u.full_name, u.id_number
//             FROM case_lawyers cl
//             JOIN users u ON cl.lawyer_id = u.id
//             WHERE cl.case_id = ?
//         `;
//             const lawyersResults = await new Promise((resolve, reject) => {
//                 db.query(lawyersQuery, [caseItem.id], (err, results) => {
//                     if (err) {
//                         return reject(err);
//                     }
//                     resolve(results);
//                 });
//             });

//             // Fetch judge information
//             const judgeQuery = `
//              SELECT u.id as judge_id, u.full_name, u.id_number
//              FROM users u
//              WHERE u.id = ?
//            `;
//             const judgeResults = await new Promise((resolve, reject) => {
//                 db.query(judgeQuery, [caseItem.judge_id], (err, results) => {
//                     if (err) {
//                         return reject(err);
//                     }
//                     resolve(results);
//                 });
//             });

//             // Fetch all sessions for the current case, ordered by session_date
//             const sessionsQuery = `
//                SELECT id, case_id, session_date, session_details, session_status, next_session_date
//                 FROM sessions
//                 WHERE case_id = ?
//                 ORDER BY session_date ASC
//             `;
//             const sessionsResults = await new Promise((resolve, reject) => {
//                 db.query(sessionsQuery, [caseItem.id], (err, results) => {
//                     if (err) {
//                         return reject(err);
//                     }
//                     resolve(results);
//                 });
//             });

//             // Fetch all attachments for the current case
//             const attachmentsQuery = `
//             SELECT id, file_path, file_type, uploaded_by_user_id, upload_time, file_name
//             FROM attachments
//             WHERE case_id = ?
//         `;
//             const attachmentsResults = await new Promise((resolve, reject) => {
//                 db.query(attachmentsQuery, [caseItem.id], (err, results) => {
//                     if (err) {
//                         return reject(err);
//                     }
//                     resolve(results);
//                 });
//             });


//             // Extract parties and lawyers
//             const plaintiff = partiesResults.find(p => p.party_type === 'plaintiff');
//             const defendant = partiesResults.find(p => p.party_type === 'defendant');
//             const otherParties = partiesResults.filter(p => p.party_type !== 'plaintiff' && p.party_type !== 'defendant');

//             const plaintiffLawyer = lawyersResults.find(l => l.party_type === 'plaintiff');
//             const defendantLawyer = lawyersResults.find(l => l.party_type === 'defendant');

//             const judge = judgeResults[0];
//           // Prepare caseData object with updated file paths
//             const caseData = {
//                 id: caseItem.id, // ADD THIS LINE
//                 case_number: caseItem.case_number,
//                 case_type: caseItem.case_type,
//                 date_of_roses: caseItem.date_of_roses,
//                 case_status: caseItem.case_status,
//                 court_name: caseItem.court_name,
//                 court_type: caseItem.court_type,
//                 plaintiff: plaintiff ? {
//                     id: plaintiff.user_id,
//                     name: plaintiff.full_name,
//                     id_number: plaintiff.id_number,
//                 } : null,
//                 plaintiffLawyer: plaintiffLawyer ? {
//                     id: plaintiffLawyer.lawyer_id,
//                     name: plaintiffLawyer.full_name,
//                     id_number: plaintiffLawyer.id_number,
//                 } : null,
//                 defendant: defendant ? {
//                     id: defendant.user_id,
//                     name: defendant.full_name,
//                     id_number: defendant.id_number,
//                 } : null,
//                 defendantLawyer: defendantLawyer ? {
//                     id: defendantLawyer.lawyer_id,
//                     name: defendantLawyer.full_name,
//                     id_number: defendantLawyer.id_number,
//                 } : null,
//                 otherParties: otherParties.map(otherParty => ({
//                     id: otherParty.user_id,
//                     name: otherParty.full_name,
//                     id_number: otherParty.id_number,
//                     party_type: otherParty.party_type,
//                 })),
//                 judge: judge ? {
//                     id: judge.judge_id,
//                     name: judge.full_name,
//                     id_number: judge.id_number,
//                 } : null,
//                 note: caseItem.note,
//                 sessions: sessionsResults.map(session => ({
//                     id: session.id,
//                     session_date: session.session_date,
//                     session_details: session.session_details,
//                     session_status: session.session_status,
//                     next_session_date: session.next_session_date,
//                 })),
//                 attachments: attachmentsResults.map(attachment => ({
//                     id: attachment.id,
//                     file_path: `${attachment.file_path}`,  // `${serverBaseUrl}${attachment.file_path}`
//                     file_type: attachment.file_type,
//                     uploaded_by_user_id: attachment.uploaded_by_user_id,
//                     upload_time: attachment.upload_time,
//                     file_name: attachment.file_name,
//                 })),
//             };


//             console.log(`Attachments for case ${caseItem.case_number}:`);
//             console.log(caseData.attachments);
//             return caseData
//         }));

//         return res.status(200).json({
//             success: true,
//             cases: allCasesWithDetails,
//         });

//     } catch (error) {
//         console.error('Database error:', error);
//         return res.status(500).json({
//             success: false,
//             message: 'Internal server error',
//         });
//     }
// });
// Route to fetch cases related to the logged-in user
router.get('/cases', verifyToken, async (req, res) => {
    const db = dbConnection();
    const userId = req.user.id;
    const userRole = req.user.role;
    const serverBaseUrl = 'http://10.0.2.2:4000';

    try {
         let query;
         let params;
    switch (userRole) {
       case 'Lawyer':
         query = `
                SELECT c.*
                FROM cases c
                JOIN case_lawyers cl ON c.id = cl.case_id
                WHERE cl.lawyer_id = ? AND c.accepted = 1
            `;
          params = [userId];
           break;
       case 'Citizen':
         query = `
            SELECT c.*
            FROM cases c
            JOIN case_parties cp ON c.id = cp.case_id
            WHERE cp.user_id = ? AND c.accepted = 1
          `;
         params = [userId];
         break;
       case 'Judge':
         query = `
                SELECT c.*
                FROM cases c
                 WHERE c.judge_id = ? AND c.accepted = 1
             `;
         params = [userId];
         break;
       default:
          return res.status(403).json({
              success: false,
              message: 'Unauthorized access.',
            });
      }

       const casesResults = await new Promise((resolve, reject) => {
            db.query(query,params ,(err, results) => {
                 if (err) return reject(err);
                  resolve(results);
            });
        });

        const allCasesWithDetails = await Promise.all(casesResults.map(async (caseItem) => {
             const partiesQuery = `
                SELECT cp.party_type, u.id AS user_id, u.full_name, u.id_number
                FROM case_parties cp
                JOIN users u ON cp.user_id = u.id
                WHERE cp.case_id = ?
            `;
            const partiesResults = await new Promise((resolve, reject) => {
                db.query(partiesQuery, [caseItem.id], (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(results);
                });
            });
         const lawyersQuery = `
            SELECT cl.party_type, u.id AS lawyer_id, u.full_name, u.id_number
            FROM case_lawyers cl
            JOIN users u ON cl.lawyer_id = u.id
            WHERE cl.case_id = ?
        `;
            const lawyersResults = await new Promise((resolve, reject) => {
                db.query(lawyersQuery, [caseItem.id], (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(results);
                });
            });

            // Fetch judge information
            const judgeQuery = `
             SELECT u.id as judge_id, u.full_name, u.id_number
             FROM users u
             WHERE u.id = ?
           `;
            const judgeResults = await new Promise((resolve, reject) => {
                db.query(judgeQuery, [caseItem.judge_id], (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(results);
                });
            });

           const sessionsQuery = `
               SELECT id, case_id, session_date, session_details, session_status, next_session_date
                FROM sessions
                WHERE case_id = ?
                ORDER BY session_date ASC
            `;
            const sessionsResults = await new Promise((resolve, reject) => {
                db.query(sessionsQuery, [caseItem.id], (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(results);
                });
            });
          const attachmentsQuery = `
                SELECT id, file_path, file_type, uploaded_by_user_id, upload_time, file_name
                FROM attachments
                WHERE case_id = ?
            `;
           const attachmentsResults = await new Promise((resolve, reject) => {
                db.query(attachmentsQuery, [caseItem.id], (err, results) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(results);
                });
            });

              const plaintiff = partiesResults.find(p => p.party_type === 'plaintiff');
            const defendant = partiesResults.find(p => p.party_type === 'defendant');
            const otherParties = partiesResults.filter(p => p.party_type !== 'plaintiff' && p.party_type !== 'defendant');

            const plaintiffLawyer = lawyersResults.find(l => l.party_type === 'plaintiff');
            const defendantLawyer = lawyersResults.find(l => l.party_type === 'defendant');

             const judge = judgeResults[0];
            const caseData = {
                id: caseItem.id, // ADD THIS LINE
                case_number: caseItem.case_number,
                case_type: caseItem.case_type,
                date_of_roses: caseItem.date_of_roses,
                case_status: caseItem.case_status,
                court_name: caseItem.court_name,
                court_type: caseItem.court_type,
                plaintiff: plaintiff ? {
                    id: plaintiff.user_id,
                    name: plaintiff.full_name,
                    id_number: plaintiff.id_number,
                } : null,
                plaintiffLawyer: plaintiffLawyer ? {
                    id: plaintiffLawyer.lawyer_id,
                    name: plaintiffLawyer.full_name,
                     id_number: plaintiffLawyer.id_number,
                } : null,
                defendant: defendant ? {
                    id: defendant.user_id,
                    name: defendant.full_name,
                    id_number: defendant.id_number,
                } : null,
                defendantLawyer: defendantLawyer ? {
                    id: defendantLawyer.lawyer_id,
                    name: defendantLawyer.full_name,
                      id_number: defendantLawyer.id_number,
                } : null,
               otherParties: otherParties.map(otherParty => ({
                    id: otherParty.user_id,
                    name: otherParty.full_name,
                     id_number: otherParty.id_number,
                      party_type: otherParty.party_type,
                 })),
                judge: judge ? {
                    id: judge.judge_id,
                    name: judge.full_name,
                    id_number: judge.id_number,
                } : null,
                note: caseItem.note,
                sessions: sessionsResults.map(session => ({
                  id: session.id,
                   session_date: session.session_date,
                  session_details: session.session_details,
                   session_status: session.session_status,
                   next_session_date: session.next_session_date,
                 })),
                attachments: attachmentsResults.map(attachment => ({
                     id: attachment.id,
                     file_path: `${attachment.file_path}`,
                    file_type: attachment.file_type,
                    uploaded_by_user_id: attachment.uploaded_by_user_id,
                     upload_time: attachment.upload_time,
                     file_name: attachment.file_name,
                })),
            };
            console.log(`Attachments for case ${caseItem.case_number}:`);
            console.log(caseData.attachments);
            return caseData
       }));

        return res.status(200).json({
            success: true,
            cases: allCasesWithDetails,
        });

    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
              error: error.message,
        });
    }
});


router.post('/create-case', verifyToken, (req, res) => {
    const pool = dbConnection(); // Get the connection pool
    const userId = req.user.id; // Lawyer's ID from token
    const {
        case_number,
        case_type,
        court_name,
        court_type,
        date_of_roses,
        note,
        plaintiff_id_number,
        defendant_id_number,
    } = req.body;

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection:', err);
            return res.status(500).json({ success: false, message: 'Database connection error' });
        }

        // Start the transaction
        connection.beginTransaction(async (err) => {
            if (err) {
                connection.release();
                console.error('Error starting transaction:', err);
                return res.status(500).json({ success: false, message: 'Transaction start failed' });
            }

            try {
                // Insert the case
                const caseInsertQuery = `
                    INSERT INTO cases (case_number, case_type, case_status, court_name, court_type, date_of_roses, note)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `;
                const caseInsertParams = [
                    case_number,
                    case_type,
                    'Ongoing', // Initial status
                    court_name,
                    court_type,
                    date_of_roses,
                    note,
                ];
               const caseInsertResults = await new Promise((resolve, reject) => {
                    connection.query(caseInsertQuery, caseInsertParams, (err, results) => {
                        if (err) return reject(err);
                        resolve(results);
                    });
                });
                 const caseId = caseInsertResults.insertId;
                // Retrieve plaintiff ID
                const plaintiffQuery = `SELECT id FROM users WHERE id_number = ?`;
                 const plaintiffResults = await new Promise((resolve, reject) => {
                  connection.query(plaintiffQuery, [plaintiff_id_number], (err, results) => {
                      if (err) return reject(err);
                      if (results.length === 0) return reject(new Error('Plaintiff not registered'));
                      resolve(results);
                  });
                });

                const plaintiffId = plaintiffResults[0].id;

                // Retrieve defendant ID
                const defendantQuery = `SELECT id FROM users WHERE id_number = ?`;
                const defendantResults = await new Promise((resolve, reject) => {
                    connection.query(defendantQuery, [defendant_id_number], (err, results) => {
                        if (err) return reject(err);
                         if (results.length === 0) return reject(new Error('Defendant not registered'));
                        resolve(results);
                    });
                });

                const defendantId = defendantResults[0].id;

                // Add plaintiff to case parties
                const plaintiffPartyQuery = `
                    INSERT INTO case_parties (case_id, user_id, party_type) VALUES (?, ?, ?)
                `;
                await new Promise((resolve, reject) => {
                    connection.query(plaintiffPartyQuery, [caseId, plaintiffId, 'plaintiff'], (err) => {
                        if (err) return reject(err);
                        resolve();
                    });
                });

                // Add defendant to case parties
                const defendantPartyQuery = `
                    INSERT INTO case_parties (case_id, user_id, party_type) VALUES (?, ?, ?)
                `;
                await new Promise((resolve, reject) => {
                    connection.query(defendantPartyQuery, [caseId, defendantId, 'defendant'], (err) => {
                        if (err) return reject(err);
                        resolve();
                    });
                });

                // Add lawyer to case lawyers
                const lawyerPartyQuery = `
                    INSERT INTO case_lawyers (case_id, lawyer_id, party_type) VALUES (?, ?, ?)
                `;
                await new Promise((resolve, reject) => {
                    connection.query(lawyerPartyQuery, [caseId, userId, 'plaintiff'], (err) => {
                        if (err) return reject(err);
                        resolve();
                    });
                });

                // Commit the transaction
                connection.commit((err) => {
                    if (err) {
                        console.error('Error committing transaction:', err);
                        return connection.rollback(() => {
                            connection.release();
                            res.status(500).json({ success: false, message: 'Transaction commit failed' });
                        });
                    }

                    connection.release();
                    res.status(200).json({ success: true, message: 'Case created successfully!' });
                });
            } catch (error) {
                console.error('Error during case creation:', error);

                // Rollback the transaction
                connection.rollback(() => {
                    connection.release();
                    res.status(500).json({
                        success: false,
                        message:
                            'Failed to create the case. Please check the data you entered or ensure all parties are registered.',
                            error: error.message
                    });
                });
            }
        });
    });
});

router.put('/update-case/:id', verifyToken, async (req, res) => {
    const pool = dbConnection();
    const caseId = req.params.id;
    const {
        case_number,
        case_type,
        case_status,
        judge_id_number,
        judge_name,
        court_name,
        court_type,
        date_of_roses,
        note,
    } = req.body;

    if (!caseId) {
        return res.status(400).json({ success: false, message: 'Case ID is required' });
    }

     const connection = await new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
              if (err) {
              console.error('Error getting database connection:', err);
              return reject({
                success: false,
                 message: 'Database connection error',
                   error: err.message,
                });
            }
            resolve(connection);
          });
      });
   try{
        await new Promise((resolve, reject) => {
          connection.beginTransaction(async (err) => {
          if (err) {
              connection.release();
              console.error('Error starting transaction:', err);
             return reject({
                success: false,
                  message: 'Transaction start failed',
                     error: err.message,
              });
            }
            resolve();
          });
      });
        try {
           // 1. Find Judge ID
            let judgeId;
            if (judge_id_number) {
                const judgeQuery = `SELECT id FROM users WHERE id_number = ? AND role = 'Judge'`;
                const judgeResults = await new Promise((resolve, reject) => {
                    connection.query(judgeQuery, [judge_id_number], (err, results) => {
                        if (err) {
                             console.error('Error fetching judge:', err);
                             return reject(err);
                             }
                        if (results.length === 0) {
                            const err = new Error('Judge not registered or invalid judge ID');
                            console.error('Error fetching judge:', err.message);
                             return reject(err);
                        }
                        resolve(results);
                    });
                });
             judgeId = judgeResults[0].id;

            }
             // 2. Update Case
            const updateCaseQuery = `
               UPDATE cases 
                SET case_number = ?, case_type = ?, case_status = ?, 
                  judge_id = ?, court_name = ?, court_type = ?, date_of_roses = ?, 
                  note = ?, accepted = ?
                WHERE id = ?
            `;
            const updateCaseParams = [
                 case_number,
                case_type,
                case_status,
                judgeId || null,
                court_name,
                court_type,
                date_of_roses,
                note,
                true,
                caseId,
            ];

        await new Promise((resolve, reject) => {
            connection.query(updateCaseQuery, updateCaseParams, (err, results) => {
                if (err) {
                   console.error('Error updating case:', err);
                  return reject(err);
                }
                if (results.affectedRows === 0) {
                    const err = new Error('Case not found with this id');
                    console.error('Error updating case:', err.message);
                   return reject(err);
                  }
                resolve(results);
              });
         });
            // 3. Get Lawyer and Parties (Plaintiff and Defendant)
           const getPartiesQuery = `
               SELECT
                 cl.lawyer_id,
                 cp.user_id,
                 cp.party_type,
                 c.judge_id
                FROM
                 case_lawyers cl
                LEFT JOIN
                  case_parties cp ON cl.case_id = cp.case_id
               JOIN
                    cases c ON cl.case_id = c.id
                WHERE cl.case_id = ?;

            `;
             const allPartiesResults = await new Promise((resolve, reject) => {
                connection.query(getPartiesQuery, [caseId], (err, results) => {
                 if (err) {
                      console.error('Error fetching parties:', err);
                      return reject(err);
                    }
                 resolve(results);
               });
           });
            const notifications = [];
         const case_number_value = allPartiesResults[0].case_number;
        const judge_id_value = allPartiesResults[0].judge_id;
            for (const party of allPartiesResults) {
                 if(party.lawyer_id){
                       notifications.push({
                        user_id: party.lawyer_id,
                       notification_type: 'Case',
                       message: `The case with number ${case_number_value} has been updated by the admin.`,
                   });
                 }
                if (party.user_id) {
                       notifications.push({
                            user_id: party.user_id,
                           notification_type: 'Case',
                            message: `The case with number ${case_number_value} has been updated by the admin.`,
                       });
                  }
                }

          if (judge_id_value) {
              notifications.push({
                   user_id: judge_id_value,
                    notification_type: 'Case',
                   message: `The case with number ${case_number_value} has been updated by the admin.`,
             });
          }
             // 4. Add Notifications
           if (notifications.length > 0) {
                const notificationInsertQuery = `
                    INSERT INTO notifications (user_id, notification_type, message) VALUES ?
                `;
                const notificationValues = notifications.map(notification => [
                   notification.user_id,
                    notification.notification_type,
                    notification.message,
               ]);
               await new Promise((resolve, reject) => {
                    connection.query(notificationInsertQuery, [notificationValues], (err) => {
                       if (err) {
                          console.error('Error adding notifications:', err);
                         return reject(err);
                        }
                         resolve();
                    });
                 });
           }

            // Commit the transaction
          await new Promise((resolve, reject) => {
            connection.commit(err => {
              if (err) {
                console.error('Error committing transaction:', err);
                return reject({
                    success: false,
                    message: 'Transaction commit failed',
                       error: err.message,
                });
              }
             resolve();
           });
          });


             connection.release();
            res.status(200).json({ success: true, message: 'Case updated successfully!' });
        } catch (error) {
          console.error('Error during transaction:', error);
          await new Promise((resolve, reject) => {
           connection.rollback(() => {
               connection.release();
                 return reject({
                  success: false,
                   message: 'Failed to update the case. Please check the data you entered or ensure all parties are registered.',
                 error: error.message,
                 });
            });
          });
        }
    }  catch (error) {
              console.error('Error during connection or transaction:', error);
              res.status(500).json({
                  success: false,
                    message: 'An unexpected error occurred.',
                    error: error.message,
                });
         }
});
module.exports = router;
