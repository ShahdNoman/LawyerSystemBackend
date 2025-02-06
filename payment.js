

// // const express = require('express');
// // const dbConnection = require('./dbconnection');
// // const verifyToken = require('./verifyToken');
// // const router = express.Router();
// // const stripe = require('stripe')('sk_test_51QlULHGgPcncAP5JWgiNXGO6R0bxifyveXv1hYw7n14YNpJfXDZSSX01uv7drt0dKNtcxppvnxHEaegY4zeqyLUd00cgawfSE3'); // Replace with your actual secret key

// // // Route to fetch payment information for cases related to the logged-in user
// // router.get('/payment', verifyToken, async (req, res) => {
// //     const db = dbConnection();
// //     const userId = req.user.id;
// //     const paymentStatusFilter = req.query.payment_status;
// //     console.log('Request received for /payment, user ID:', userId, 'payment status filter:', paymentStatusFilter);
// //     try {
// //         let paymentsQuery = `
// //             SELECT 
// //                 p.id,
// //                 p.case_id,
// //                 p.amount,
// //                 p.payment_date,
// //                 p.payment_status,
// //                 p.is_disbursed,
// //                 u.full_name AS payer_name
// //             FROM payments p
// //             JOIN users u ON p.user_id = u.id
// //              WHERE p.case_id IN (
// //                 SELECT case_id
// //                 FROM case_lawyers
// //                 WHERE lawyer_id = ?
// //                 UNION
// //                 SELECT case_id
// //                 FROM case_parties
// //                 WHERE user_id = ?
// //             )
// //         `;
// //         const queryParams = [userId, userId];
// //         console.log('SQL query before adding filter:', paymentsQuery, 'query parameters:', queryParams);
// //         if (paymentStatusFilter && paymentStatusFilter !== 'All') {
// //             paymentsQuery += ' AND p.payment_status = ?';
// //             queryParams.push(paymentStatusFilter);
// //             console.log('SQL query after adding filter:', paymentsQuery, 'query parameters:', queryParams);
// //         }

// //         const paymentsResults = await new Promise((resolve, reject) => {
// //             db.query(paymentsQuery, queryParams, (err, results) => {
// //                 if (err) {
// //                     console.error('Error executing SQL query:', err);
// //                     return reject(err);
// //                 }
// //                 console.log('Payments results from database:', results);
// //                 resolve(results);
// //             });
// //         });

// //         // Transform the results into the desired format
// //         const formattedPayments = paymentsResults.map(payment => ({
// //             id: payment.id,
// //             case_id: payment.case_id,
// //             amount: payment.amount,
// //             payment_date: payment.payment_date,
// //             payment_status: payment.payment_status,
// //             is_disbursed: payment.is_disbursed,
// //             payer_name: payment.payer_name,
// //         }));
// //         console.log('Formatted payments:', formattedPayments);

// //         return res.status(200).json({
// //             success: true,
// //             userId: userId,
// //             payments: formattedPayments,
// //         });
// //     } catch (error) {
// //         console.error('Database error:', error);
// //         return res.status(500).json({
// //             success: false,
// //             message: 'Internal server error',
// //         });
// //     }
// // });

// // // Route to update the disbursement status of a payment
// // router.put('/update-disbursed', verifyToken, async (req, res) => {
// //     const db = dbConnection();
// //     const { payment_id, is_disbursed } = req.body;
// //     console.log('Request received for /update-disbursed, payment ID:', payment_id, 'is disbursed:', is_disbursed);

// //     try {
// //         const updateQuery = `
// //             UPDATE payments
// //             SET is_disbursed = ?
// //             WHERE id = ?
// //         `;
// //         console.log('SQL update query:', updateQuery, 'Parameters:', [is_disbursed, payment_id])

// //         await new Promise((resolve, reject) => {
// //             db.query(updateQuery, [is_disbursed, payment_id], (err, result) => {
// //                 if (err) {
// //                     console.error('Error executing update query:', err);
// //                     return reject(err);
// //                 }
// //                 console.log('Update result:', result);
// //                 if (result.affectedRows === 0) {
// //                     console.error('Payment not found');
// //                     return reject(new Error('Payment not found'));
// //                 }
// //                 resolve(result);
// //             });
// //         });

// //         return res.status(200).json({
// //             success: true,
// //             message: 'Payment status updated successfully.',
// //         });
// //     } catch (error) {
// //         console.error('Database error:', error);
// //         return res.status(500).json({
// //             success: false,
// //             message: error.message || 'Failed to update payment status',
// //         });
// //     }
// // });

// // // Route to fetch case details by case number
// // router.get('/case/:caseId', verifyToken, async (req, res) => {
// //     const db = dbConnection();
// //     const caseId = req.params.caseId;
// //     console.log('Request received for /case/:caseId, Case ID:', caseId);

// //     try {
// //         const caseQuery = `
// //             SELECT c.*
// //             FROM cases c
// //             WHERE c.id = ?
// //         `;
// //         console.log('Case query:', caseQuery, 'Parameters:', [caseId])

// //         const caseResults = await new Promise((resolve, reject) => {
// //             db.query(caseQuery, [caseId], (err, results) => {
// //                 if (err) {
// //                     console.error('Error executing case query:', err);
// //                     return reject(err);
// //                 }
// //                 if (results.length === 0) {
// //                     console.error('Case not found with this id:', caseId);
// //                     return reject(new Error('Case not found'));
// //                 }
// //                 console.log('Case results:', results[0]);
// //                 resolve(results[0]);
// //             });
// //         });
// //         // Fetch all parties information from case_parties
// //         const partiesQuery = `
// //                     SELECT cp.party_type, u.id AS user_id, u.full_name, u.id_number
// //                     FROM case_parties cp
// //                     JOIN users u ON cp.user_id = u.id
// //                     WHERE cp.case_id = ?
// //                 `;
// //         console.log('Parties query:', partiesQuery, 'Parameters:', [caseResults.id])
// //         const partiesResults = await new Promise((resolve, reject) => {
// //             db.query(partiesQuery, [caseResults.id], (err, results) => {
// //                 if (err) {
// //                     console.error('Error executing parties query:', err);
// //                     return reject(err);
// //                 }
// //                 console.log('Parties results:', results);
// //                 resolve(results);
// //             });
// //         });
// //         // Fetch lawyers for all parties
// //         const lawyersQuery = `
// //                     SELECT cl.party_type, u.id AS lawyer_id, u.full_name, u.id_number
// //                     FROM case_lawyers cl
// //                     JOIN users u ON cl.lawyer_id = u.id
// //                     WHERE cl.case_id = ?
// //                 `;
// //         console.log('Lawyers query:', lawyersQuery, 'Parameters:', [caseResults.id])
// //         const lawyersResults = await new Promise((resolve, reject) => {
// //             db.query(lawyersQuery, [caseResults.id], (err, results) => {
// //                 if (err) {
// //                     console.error('Error executing lawyers query:', err);
// //                     return reject(err);
// //                 }
// //                 console.log('Lawyers results:', results);
// //                 resolve(results);
// //             });
// //         });

// //         // Extract parties and lawyers
// //         const plaintiff = partiesResults.find(p => p.party_type === 'plaintiff');
// //         console.log('Plaintiff:', plaintiff);
// //         const defendant = partiesResults.find(p => p.party_type === 'defendant');
// //         console.log('Defendant:', defendant);
// //         const otherParties = partiesResults.filter(p => p.party_type !== 'plaintiff' && p.party_type !== 'defendant');
// //         console.log('Other parties:', otherParties);
// //         const plaintiffLawyer = lawyersResults.find(l => l.party_type === 'plaintiff');
// //         console.log('Plaintiff lawyer:', plaintiffLawyer);
// //         const defendantLawyer = lawyersResults.find(l => l.party_type === 'defendant');
// //         console.log('Defendant lawyer:', defendantLawyer);


// //         const caseData = {
// //             case_number: caseResults.case_number,
// //             case_type: caseResults.case_type,
// //             date_of_roses: caseResults.date_of_roses,
// //             case_status: caseResults.case_status,
// //             court_name: caseResults.court_name,
// //             court_type: caseResults.court_type,
// //             plaintiff: plaintiff ? {
// //                 id: plaintiff.user_id,
// //                 name: plaintiff.full_name,
// //                 id_number: plaintiff.id_number,
// //             } : null,
// //             plaintiffLawyer: plaintiffLawyer ? {
// //                 id: plaintiffLawyer.lawyer_id,
// //                 name: plaintiffLawyer.full_name,
// //                 id_number: plaintiffLawyer.id_number,
// //             } : null,
// //             defendant: defendant ? {
// //                 id: defendant.user_id,
// //                 name: defendant.full_name,
// //                 id_number: defendant.id_number,
// //             } : null,
// //             defendantLawyer: defendantLawyer ? {
// //                 id: defendantLawyer.lawyer_id,
// //                 name: defendantLawyer.full_name,
// //                 id_number: defendantLawyer.id_number,
// //             } : null,
// //             otherParties: otherParties.map(otherParty => ({
// //                 id: otherParty.user_id,
// //                 name: otherParty.full_name,
// //                 id_number: otherParty.id_number,
// //                 party_type: otherParty.party_type,
// //             })),
// //         };
// //         console.log('Case data:', caseData);
// //         return res.status(200).json({
// //             success: true,
// //             case: caseData,
// //         });
// //     } catch (error) {
// //         console.error('Database error:', error);
// //         return res.status(500).json({
// //             success: false,
// //             message: error.message || 'Failed to fetch case details',
// //         });
// //     }
// // });
// // router.post('/create-payment-session', verifyToken, async (req, res) => {
// //     const db = dbConnection();
// //     const { caseId, amount, paymentMethod } = req.body;
// //     const userId = req.user.id;
// //     console.log('Request received for /create-payment-session, user ID:', userId, 'case ID:', caseId, 'amount:', amount, 'paymentMethod:', paymentMethod);

// //     try {
// //         if (paymentMethod && paymentMethod.startsWith('fake_pm_')) {
// //             // Handle fake payment
// //             const insertPaymentQuery = `
// //               INSERT INTO payments (case_id, user_id, amount, payment_date, payment_status, is_disbursed)
// //                VALUES (?, ?, ?, NOW(), ?, ?)
// //             `;

// //             await new Promise((resolve, reject) => {
// //                 db.query(insertPaymentQuery, [caseId, userId, amount, 'completed', 0], (err, result) => {
// //                     if (err) {
// //                         console.error('Error inserting fake payment into database:', err);
// //                         return reject(err);
// //                     }
// //                     console.log('Fake payment inserted into database:', result);
// //                     resolve(result);
// //                 });
// //             });

// //             return res.status(200).json({ success: true, message: 'Fake payment processed successfully' });
// //         } else {
// //             // Handle real payment
// //             const session = await stripe.checkout.sessions.create({
// //                 payment_method_types: ['card'],
// //                 payment_method: paymentMethod,
// //                 line_items: [
// //                     {
// //                         price_data: {
// //                             currency: 'usd',
// //                             unit_amount: amount * 100,
// //                             product_data: {
// //                                 name: `Payment for case ID: ${caseId}`,
// //                             },
// //                         },
// //                         quantity: 1,
// //                     },
// //                 ],
// //                 mode: 'payment',
// //                 success_url: 'http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
// //                 cancel_url: 'http://localhost:3000/cancel',
// //             });
// //             console.log('Stripe session created:', session);
// //             //save case information with payment intent
// //             const insertPaymentQuery = `
// //                INSERT INTO payments (case_id, user_id, amount, payment_date, payment_status, is_disbursed)
// //               VALUES (?, ?, ?, NOW(), ?,?)
// //            `;

// //             await new Promise((resolve, reject) => {
// //                 db.query(insertPaymentQuery, [caseId, userId, amount, 'pending', 0], (err, result) => {
// //                     if (err) {
// //                         console.error('Error inserting payment into database:', err);
// //                         return reject(err);
// //                     }
// //                     console.log('Payment inserted into database:', result);
// //                     resolve(result);
// //                 });
// //             });
// //             res.status(200).json({ success: true, sessionId: session.id });
// //         }
// //     } catch (error) {
// //         console.error('Error creating payment session:', error);
// //         res.status(500).json({ success: false, message: 'Failed to create payment session' });
// //     }
// // });


// // router.post('/payment-success', async (req, res) => {
// //     const db = dbConnection();
// //     const { session_id } = req.body;
// //     console.log('Request received for /payment-success, session ID:', session_id);
// //     try {
// //         const session = await stripe.checkout.sessions.retrieve(session_id);
// //         console.log('Retrieved Stripe session:', session);
// //         if(session.payment_status == 'paid'){
// //             const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);
// //             console.log('Retrieved Stripe payment intent:', paymentIntent);
// //             const updatePaymentQuery = `
// //               UPDATE payments
// //               SET payment_status = ? , payment_intent = ?
// //               WHERE id = (SELECT id from payments where payment_intent IS NULL and case_id = ? order by payment_date desc limit 1)
// //           `;

// //             await new Promise((resolve, reject) => {
// //                 db.query(updatePaymentQuery, ['completed',session.payment_intent,session.metadata.caseId], (err, result) => {
// //                     if (err) {
// //                         console.error('Error updating payment status in database:', err);
// //                         return reject(err);
// //                     }
// //                     console.log('Payment status updated in database:', result);
// //                     resolve(result);
// //                 });
// //             });

// //             res.status(200).json({ success: true, message: 'Payment completed successfully.' });
// //         } else {
// //             console.error('Payment not completed in stripe');
// //             res.status(400).json({ success: false, message: 'Payment not completed' });
// //         }
// //     }
// //     catch (error) {
// //         console.error('Error during payment success verification:', error);
// //         res.status(500).json({ success: false, message: 'Failed to verify payment success' });
// //     }
// // });

// // module.exports = router;

// const stripe = require('stripe')('sk_test_51QlULHGgPcncAP5JWgiNXGO6R0bxifyveXv1hYw7n14YNpJfXDZSSX01uv7drt0dKNtcxppvnxHEaegY4zeqyLUd00cgawfSE3'); // Replace with your actual secret key

// // Route to fetch payment information for cases related to the logged-in user
// router.get('/payment', verifyToken, async (req, res) => {
//     const db = dbConnection();
//     const userId = req.user.id;
//     const paymentStatusFilter = req.query.payment_status;
//     console.log('Request received for /payment, user ID:', userId, 'payment status filter:', paymentStatusFilter);
//     try {
//         let paymentsQuery = `
//             SELECT 
//                 p.id,
//                 p.case_id,
//                 p.amount,
//                 p.payment_date,
//                 p.payment_status,
//                 p.is_disbursed,
//                 u.full_name AS payer_name
//             FROM payments p
//             JOIN users u ON p.user_id = u.id
//              WHERE p.case_id IN (
//                 SELECT case_id
//                 FROM case_lawyers
//                 WHERE lawyer_id = ?
//                 UNION
//                 SELECT case_id
//                 FROM case_parties
//                 WHERE user_id = ?
//             )
//         `;
//         const queryParams = [userId, userId];
//         console.log('SQL query before adding filter:', paymentsQuery, 'query parameters:', queryParams);
//         if (paymentStatusFilter && paymentStatusFilter !== 'All') {
//             paymentsQuery += ' AND p.payment_status = ?';
//             queryParams.push(paymentStatusFilter);
//             console.log('SQL query after adding filter:', paymentsQuery, 'query parameters:', queryParams);
//         }

//         const paymentsResults = await new Promise((resolve, reject) => {
//             db.query(paymentsQuery, queryParams, (err, results) => {
//                 if (err) {
//                     console.error('Error executing SQL query:', err);
//                     return reject(err);
//                 }
//                 console.log('Payments results from database:', results);
//                 resolve(results);
//             });
//         });

//         // Transform the results into the desired format
//         const formattedPayments = paymentsResults.map(payment => ({
//             id: payment.id,
//             case_id: payment.case_id,
//             amount: payment.amount,
//             payment_date: payment.payment_date,
//             payment_status: payment.payment_status,
//             is_disbursed: payment.is_disbursed,
//             payer_name: payment.payer_name,
//         }));
//         console.log('Formatted payments:', formattedPayments);

//         return res.status(200).json({
//             success: true,
//             userId: userId,
//             payments: formattedPayments,
//         });
//     } catch (error) {
//         console.error('Database error:', error);
//         return res.status(500).json({
//             success: false,
//             message: 'Internal server error',
//         });
//     }
// });

// // Route to update the disbursement status of a payment
// router.put('/update-disbursed', verifyToken, async (req, res) => {
//     const db = dbConnection();
//     const { payment_id, is_disbursed } = req.body;
//     console.log('Request received for /update-disbursed, payment ID:', payment_id, 'is disbursed:', is_disbursed);

//     try {
//         const updateQuery = `
//             UPDATE payments
//             SET is_disbursed = ?
//             WHERE id = ?
//         `;
//         console.log('SQL update query:', updateQuery, 'Parameters:', [is_disbursed, payment_id])

//         await new Promise((resolve, reject) => {
//             db.query(updateQuery, [is_disbursed, payment_id], (err, result) => {
//                 if (err) {
//                     console.error('Error executing update query:', err);
//                     return reject(err);
//                 }
//                 console.log('Update result:', result);
//                 if (result.affectedRows === 0) {
//                     console.error('Payment not found');
//                     return reject(new Error('Payment not found'));
//                 }
//                 resolve(result);
//             });
//         });

//         return res.status(200).json({
//             success: true,
//             message: 'Payment status updated successfully.',
//         });
//     } catch (error) {
//         console.error('Database error:', error);
//         return res.status(500).json({
//             success: false,
//             message: error.message || 'Failed to update payment status',
//         });
//     }
// });

// // Route to fetch case details by case number
// router.get('/case/:caseId', verifyToken, async (req, res) => {
//     const db = dbConnection();
//     const caseId = req.params.caseId;
//     console.log('Request received for /case/:caseId, Case ID:', caseId);

//     try {
//         const caseQuery = `
//             SELECT c.*
//             FROM cases c
//             WHERE c.id = ?
//         `;
//         console.log('Case query:', caseQuery, 'Parameters:', [caseId])

//         const caseResults = await new Promise((resolve, reject) => {
//             db.query(caseQuery, [caseId], (err, results) => {
//                 if (err) {
//                     console.error('Error executing case query:', err);
//                     return reject(err);
//                 }
//                 if (results.length === 0) {
//                     console.error('Case not found with this id:', caseId);
//                     return reject(new Error('Case not found'));
//                 }
//                 console.log('Case results:', results[0]);
//                 resolve(results[0]);
//             });
//         });
//         // Fetch all parties information from case_parties
//         const partiesQuery = `
//                     SELECT cp.party_type, u.id AS user_id, u.full_name, u.id_number
//                     FROM case_parties cp
//                     JOIN users u ON cp.user_id = u.id
//                     WHERE cp.case_id = ?
//                 `;
//         console.log('Parties query:', partiesQuery, 'Parameters:', [caseResults.id])
//         const partiesResults = await new Promise((resolve, reject) => {
//             db.query(partiesQuery, [caseResults.id], (err, results) => {
//                 if (err) {
//                     console.error('Error executing parties query:', err);
//                     return reject(err);
//                 }
//                 console.log('Parties results:', results);
//                 resolve(results);
//             });
//         });
//         // Fetch lawyers for all parties
//         const lawyersQuery = `
//                     SELECT cl.party_type, u.id AS lawyer_id, u.full_name, u.id_number
//                     FROM case_lawyers cl
//                     JOIN users u ON cl.lawyer_id = u.id
//                     WHERE cl.case_id = ?
//                 `;
//         console.log('Lawyers query:', lawyersQuery, 'Parameters:', [caseResults.id])
//         const lawyersResults = await new Promise((resolve, reject) => {
//             db.query(lawyersQuery, [caseResults.id], (err, results) => {
//                 if (err) {
//                     console.error('Error executing lawyers query:', err);
//                     return reject(err);
//                 }
//                 console.log('Lawyers results:', results);
//                 resolve(results);
//             });
//         });

//         // Extract parties and lawyers
//         const plaintiff = partiesResults.find(p => p.party_type === 'plaintiff');
//         console.log('Plaintiff:', plaintiff);
//         const defendant = partiesResults.find(p => p.party_type === 'defendant');
//         console.log('Defendant:', defendant);
//         const otherParties = partiesResults.filter(p => p.party_type !== 'plaintiff' && p.party_type !== 'defendant');
//         console.log('Other parties:', otherParties);
//         const plaintiffLawyer = lawyersResults.find(l => l.party_type === 'plaintiff');
//         console.log('Plaintiff lawyer:', plaintiffLawyer);
//         const defendantLawyer = lawyersResults.find(l => l.party_type === 'defendant');
//         console.log('Defendant lawyer:', defendantLawyer);


//         const caseData = {
//             case_number: caseResults.case_number,
//             case_type: caseResults.case_type,
//             date_of_roses: caseResults.date_of_roses,
//             case_status: caseResults.case_status,
//             court_name: caseResults.court_name,
//             court_type: caseResults.court_type,
//             plaintiff: plaintiff ? {
//                 id: plaintiff.user_id,
//                 name: plaintiff.full_name,
//                 id_number: plaintiff.id_number,
//             } : null,
//             plaintiffLawyer: plaintiffLawyer ? {
//                 id: plaintiffLawyer.lawyer_id,
//                 name: plaintiffLawyer.full_name,
//                 id_number: plaintiffLawyer.id_number,
//             } : null,
//             defendant: defendant ? {
//                 id: defendant.user_id,
//                 name: defendant.full_name,
//                 id_number: defendant.id_number,
//             } : null,
//             defendantLawyer: defendantLawyer ? {
//                 id: defendantLawyer.lawyer_id,
//                 name: defendantLawyer.full_name,
//                 id_number: defendantLawyer.id_number,
//             } : null,
//             otherParties: otherParties.map(otherParty => ({
//                 id: otherParty.user_id,
//                 name: otherParty.full_name,
//                 id_number: otherParty.id_number,
//                 party_type: otherParty.party_type,
//             })),
//         };
//         console.log('Case data:', caseData);
//         return res.status(200).json({
//             success: true,
//             case: caseData,
//         });
//     } catch (error) {
//         console.error('Database error:', error);
//         return res.status(500).json({
//             success: false,
//             message: error.message || 'Failed to fetch case details',
//         });
//     }
// });

// // Route to create a Stripe payment session
// router.post('/create-payment-session', verifyToken, async (req, res) => {
//     const db = dbConnection();
//     const { caseId, amount, paymentMethod } = req.body;
//     const userId = req.user.id;
//     console.log('Request received for /create-payment-session, user ID:', userId, 'case ID:', caseId, 'amount:', amount, 'paymentMethod:', paymentMethod);

//     try {
//          if (paymentMethod && paymentMethod.startsWith('fake_pm_')) {
//             // Handle fake payment
//             const insertPaymentQuery = `
//               INSERT INTO payments (case_id, user_id, amount, payment_date, payment_status, is_disbursed)
//                VALUES (?, ?, ?, NOW(), ?, ?)
//             `;

//             await new Promise((resolve, reject) => {
//                 db.query(insertPaymentQuery, [caseId, userId, amount, 'completed', 0], (err, result) => {
//                     if (err) {
//                         console.error('Error inserting fake payment into database:', err);
//                         return reject(err);
//                     }
//                     console.log('Fake payment inserted into database:', result);
//                     resolve(result);
//                 });
//             });

//             return res.status(200).json({ success: true, message: 'Fake payment processed successfully' });
//         } else {
//             // Handle real payment
//             const session = await stripe.checkout.sessions.create({
//                 payment_method_types: ['card'],
//                 payment_method: paymentMethod,
//                 line_items: [
//                     {
//                         price_data: {
//                             currency: 'usd',
//                             unit_amount: amount * 100,
//                              product_data: {
//                                  name: `Payment for case ID: ${caseId}`,
//                             },
//                         },
//                         quantity: 1,
//                     },
//                 ],
//                 mode: 'payment',
//                 success_url: 'http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
//                 cancel_url: 'http://localhost:3000/cancel',
//             });
//             console.log('Stripe session created:', session);
//             //save case information with payment intent
//             const insertPaymentQuery = `
//                INSERT INTO payments (case_id, user_id, amount, payment_date, payment_status, is_disbursed)
//               VALUES (?, ?, ?, NOW(), ?,?)
//            `;

//             await new Promise((resolve, reject) => {
//                 db.query(insertPaymentQuery, [caseId, userId, amount, 'pending', 0], (err, result) => {
//                     if (err) {
//                         console.error('Error inserting payment into database:', err);
//                         return reject(err);
//                     }
//                     console.log('Payment inserted into database:', result);
//                     resolve(result);
//                 });
//             });
//             res.status(200).json({ success: true, sessionId: session.id });
//         }
//     } catch (error) {
//         console.error('Error creating payment session:', error);
//         res.status(500).json({ success: false, message: 'Failed to create payment session' });
//     }
// });

// router.post('/payment-success', async (req, res) => {
//     const db = dbConnection();
//     const { session_id } = req.body;
//     console.log('Request received for /payment-success, session ID:', session_id);
//     try {
//         const session = await stripe.checkout.sessions.retrieve(session_id);
//         console.log('Retrieved Stripe session:', session);
//         if(session.payment_status == 'paid'){
//             const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);
//             console.log('Retrieved Stripe payment intent:', paymentIntent);
//             const updatePaymentQuery = `
//               UPDATE payments
//               SET payment_status = ? , payment_intent = ?
//               WHERE id = (SELECT id from payments where payment_intent IS NULL and case_id = ? order by payment_date desc limit 1)
//           `;

//             await new Promise((resolve, reject) => {
//                 db.query(updatePaymentQuery, ['completed',session.payment_intent,session.metadata.caseId], (err, result) => {
//                     if (err) {
//                         console.error('Error updating payment status in database:', err);
//                         return reject(err);
//                     }
//                     console.log('Payment status updated in database:', result);
//                     resolve(result);
//                 });
//             });

//             res.status(200).json({ success: true, message: 'Payment completed successfully.' });
//         } else {
//             console.error('Payment not completed in stripe');
//             res.status(400).json({ success: false, message: 'Payment not completed' });
//         }
//     }
//     catch (error) {
//         console.error('Error during payment success verification:', error);
//         res.status(500).json({ success: false, message: 'Failed to verify payment success' });
//     }
// });
//  // Route to fetch case ID by case number
// router.get('/case-id/:caseNumber', verifyToken, async (req, res) => {
//     const db = dbConnection();
//     const caseNumber = req.params.caseNumber;
//     console.log('Request received for /case-id/:caseNumber, Case Number:', caseNumber);

//     try {
//         const caseQuery = `
//             SELECT id
//             FROM cases
//             WHERE case_number = ?
//         `;

//         const caseResults = await new Promise((resolve, reject) => {
//             db.query(caseQuery, [caseNumber], (err, results) => {
//                 if (err) {
//                     console.error('Error executing case query:', err);
//                     return reject(err);
//                 }
//                 if (results.length === 0) {
//                      console.error('Case not found with this number:', caseNumber);
//                     return reject(new Error('Case not found'));
//                 }
//                  console.log('Case ID results:', results[0].id);
//                 resolve(results[0].id); // Resolve with the case ID
//             });
//         });
//         return res.status(200).json({
//             success: true,
//             caseId: caseResults, // Send the case ID
//         });
//     } catch (error) {
//         console.error('Database error:', error);
//         return res.status(500).json({
//             success: false,
//             message: error.message || 'Failed to fetch case ID',
//         });
//     }
// });

const express = require('express');
const dbConnection = require('./dbconnection');
const verifyToken = require('./verifyToken');
const router = express.Router();

const stripe = require('stripe')('sk_test_51QlULHGgPcncAP5JWgiNXGO6R0bxifyveXv1hYw7n14YNpJfXDZSSX01uv7drt0dKNtcxppvnxHEaegY4zeqyLUd00cgawfSE3'); // Replace with your actual secret key

// Function to execute queries
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

// Function to format payment data
const formatPayments = (paymentsResults) => {
    return paymentsResults.map(payment => ({
        id: payment.id,
        case_id: payment.case_id,
        amount: payment.amount,
        payment_date: payment.payment_date,
        payment_status: payment.payment_status,
        is_disbursed: payment.is_disbursed,
        payer_name: payment.payer_name,
    }));
};

// Route to fetch payment information for cases related to the logged-in user
router.get('/payment', verifyToken, async (req, res) => {
    const db = dbConnection();
    const userId = req.user.id;
    const userRole = req.user.role;
    const paymentStatusFilter = req.query.payment_status;

     console.log('Request received for /payment, user ID:', userId, 'userRole:', userRole, 'payment status filter:', paymentStatusFilter);
     let paymentsQuery, queryParams;
    try {
          switch (userRole) {
            case 'Lawyer':
                paymentsQuery = `
                 SELECT 
                     p.id,
                     p.case_id,
                     p.amount,
                    p.payment_date,
                      p.payment_status,
                     p.is_disbursed,
                       u.full_name AS payer_name
                    FROM payments p
                    JOIN users u ON p.user_id = u.id
                  WHERE p.case_id IN (
                       SELECT case_id
                         FROM case_lawyers
                       WHERE lawyer_id = ?
                  )
                 `;
                queryParams = [userId];
                 break;
             case 'Citizen':
                 paymentsQuery = `
                       SELECT 
                        p.id,
                        p.case_id,
                         p.amount,
                         p.payment_date,
                       p.payment_status,
                         p.is_disbursed,
                       u.full_name AS payer_name
                    FROM payments p
                     JOIN users u ON p.user_id = u.id
                   WHERE p.case_id IN (
                         SELECT case_id
                        FROM case_parties
                         WHERE user_id = ?
                     )
                `;
                queryParams = [userId];
               break;
            case 'Judge':
                paymentsQuery = `
                     SELECT 
                       p.id,
                       p.case_id,
                        p.amount,
                        p.payment_date,
                        p.payment_status,
                        p.is_disbursed,
                        u.full_name AS payer_name
                    FROM payments p
                   JOIN users u ON p.user_id = u.id
                   WHERE p.case_id IN (
                        SELECT id
                        FROM cases
                        WHERE judge_id = ?
                     )
                `;
                  queryParams = [userId];
                 break;
            default:
                 return res.status(400).json({ success: false, message: 'Invalid user role' });
        }
        if (paymentStatusFilter && paymentStatusFilter !== 'All') {
                paymentsQuery += ' AND p.payment_status = ?';
                queryParams.push(paymentStatusFilter);
         }

        const paymentsResults =  await executeQuery(db,paymentsQuery, queryParams)
            const formattedPayments = formatPayments(paymentsResults);
           return res.status(200).json({ success: true, userId: userId, payments: formattedPayments });
     } catch (error) {
         console.error('Database error:', error);
         return res.status(500).json({ success: false, message: 'Internal server error' });
     }
});

// Route to update the disbursement status of a payment
router.put('/update-disbursed', verifyToken, async (req, res) => {
    const db = dbConnection();
    const { payment_id, is_disbursed } = req.body;
    const userRole = req.user.role;
    console.log('Request received for /update-disbursed, payment ID:', payment_id, 'is disbursed:', is_disbursed, 'User role:', userRole);

    if(userRole === 'Judge') {
        return res.status(403).json({
            success: false,
            message: 'Judges are not allowed to update payment disbursement status.',
        });
    }
    try {
        const updateQuery = `
            UPDATE payments
            SET is_disbursed = ?
            WHERE id = ?
        `;
        console.log('SQL update query:', updateQuery, 'Parameters:', [is_disbursed, payment_id])

        await executeQuery(db,updateQuery, [is_disbursed, payment_id])
        return res.status(200).json({
            success: true,
            message: 'Payment status updated successfully.',
        });
    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to update payment status',
        });
    }
});

// Route to fetch case details by case number
router.get('/case/:caseId', verifyToken, async (req, res) => {
    const db = dbConnection();
    const caseId = req.params.caseId;
    console.log('Request received for /case/:caseId, Case ID:', caseId);

    try {
        const caseQuery = `
            SELECT c.*
            FROM cases c
            WHERE c.id = ?
        `;
        console.log('Case query:', caseQuery, 'Parameters:', [caseId])

        const caseResults = await executeQuery(db,caseQuery, [caseId])
             if (!caseResults || caseResults.length === 0) {
                return res.status(404).json({ success: false, message: 'Case not found' });
           }
         const caseData = caseResults[0]

          const partiesQuery = `
                     SELECT cp.party_type, u.id AS user_id, u.full_name, u.id_number
                    FROM case_parties cp
                    JOIN users u ON cp.user_id = u.id
                     WHERE cp.case_id = ?
                `;
         const partiesResults = await executeQuery(db,partiesQuery, [caseData.id])
            const lawyersQuery = `
                    SELECT cl.party_type, u.id AS lawyer_id, u.full_name, u.id_number
                   FROM case_lawyers cl
                    JOIN users u ON cl.lawyer_id = u.id
                    WHERE cl.case_id = ?
                `;
         const lawyersResults = await executeQuery(db,lawyersQuery, [caseData.id])

        // Extract parties and lawyers
        const plaintiff = partiesResults.find(p => p.party_type === 'plaintiff');
         const defendant = partiesResults.find(p => p.party_type === 'defendant');
         const otherParties = partiesResults.filter(p => p.party_type !== 'plaintiff' && p.party_type !== 'defendant');
         const plaintiffLawyer = lawyersResults.find(l => l.party_type === 'plaintiff');
         const defendantLawyer = lawyersResults.find(l => l.party_type === 'defendant');


        const caseInfo = {
            case_number: caseData.case_number,
            case_type: caseData.case_type,
            date_of_roses: caseData.date_of_roses,
            case_status: caseData.case_status,
            court_name: caseData.court_name,
            court_type: caseData.court_type,
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
         };
        return res.status(200).json({
            success: true,
            case: caseInfo,
        });
    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({
            success: false,
             message: error.message || 'Failed to fetch case details',
        });
    }
});

// Route to create a Stripe payment session
router.post('/create-payment-session', verifyToken, async (req, res) => {
    const db = dbConnection();
    const { caseId, amount, paymentMethod } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;
    console.log('Request received for /create-payment-session, user ID:', userId, 'case ID:', caseId, 'amount:', amount, 'paymentMethod:', paymentMethod, 'User role:', userRole);
     if(userRole === 'Judge') {
        return res.status(403).json({
            success: false,
            message: 'Judges are not allowed to create payment sessions.',
        });
    }

    try {
         if (paymentMethod && paymentMethod.startsWith('fake_pm_')) {
            // Handle fake payment
            const insertPaymentQuery = `
              INSERT INTO payments (case_id, user_id, amount, payment_date, payment_status, is_disbursed)
               VALUES (?, ?, ?, NOW(), ?, ?)
            `;

            await executeQuery(db,insertPaymentQuery, [caseId, userId, amount, 'completed', 0])
            return res.status(200).json({ success: true, message: 'Fake payment processed successfully' });
        } else {
            // Handle real payment
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                payment_method: paymentMethod,
                line_items: [
                    {
                        price_data: {
                            currency: 'usd',
                             unit_amount: amount * 100,
                             product_data: {
                                 name: `Payment for case ID: ${caseId}`,
                           },
                        },
                       quantity: 1,
                    },
               ],
               mode: 'payment',
                success_url: 'http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}',
                cancel_url: 'http://localhost:3000/cancel',
            });
             //save case information with payment intent
             const insertPaymentQuery = `
                INSERT INTO payments (case_id, user_id, amount, payment_date, payment_status, is_disbursed)
                VALUES (?, ?, ?, NOW(), ?,?)
            `;

            await executeQuery(db,insertPaymentQuery, [caseId, userId, amount, 'pending', 0])
             res.status(200).json({ success: true, sessionId: session.id });
       }
     } catch (error) {
         console.error('Error creating payment session:', error);
         res.status(500).json({ success: false, message: 'Failed to create payment session' });
    }
});

router.post('/payment-success', async (req, res) => {
    const db = dbConnection();
     const { session_id } = req.body;
    console.log('Request received for /payment-success, session ID:', session_id);
    try {
        const session = await stripe.checkout.sessions.retrieve(session_id);
          if(session.payment_status == 'paid'){
            const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);
              const updatePaymentQuery = `
                UPDATE payments
                SET payment_status = ? , payment_intent_id = ?
               WHERE id = (SELECT id from payments where payment_intent_id IS NULL and case_id = ? order by payment_date desc limit 1)
            `;

             await executeQuery(db,updatePaymentQuery, ['completed',session.payment_intent,session.metadata.caseId])
               res.status(200).json({ success: true, message: 'Payment completed successfully.' });
        } else {
             console.error('Payment not completed in stripe');
             res.status(400).json({ success: false, message: 'Payment not completed' });
       }
    }
    catch (error) {
         console.error('Error during payment success verification:', error);
         res.status(500).json({ success: false, message: 'Failed to verify payment success' });
   }
});
 // Route to fetch case ID by case number
router.get('/case-id/:caseNumber', verifyToken, async (req, res) => {
    const db = dbConnection();
    const caseNumber = req.params.caseNumber;
    console.log('Request received for /case-id/:caseNumber, Case Number:', caseNumber);

    try {
        const caseQuery = `
           SELECT id
            FROM cases
          WHERE case_number = ?
        `;

        const caseResults = await executeQuery(db,caseQuery, [caseNumber])
        if (!caseResults || caseResults.length === 0) {
             return res.status(404).json({ success: false, message: 'Case not found' });
         }
            return res.status(200).json({
             success: true,
              caseId: caseResults[0].id, // Send the case ID
        });
    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({
            success: false,
             message: error.message || 'Failed to fetch case ID',
       });
    }
});
 module.exports = router;
