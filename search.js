
const express = require('express');
const dbConnection = require('./dbconnection'); // الاتصال بقاعدة البيانات
const router = express.Router();

// مسار GET للبحث عن مستخدم بناءً على الاسم في الـ URL
router.get('/search/:username', (req, res) => {
  const db = dbConnection();
  const username = req.params.username;  // الحصول على اسم المستخدم من الـ URL

  console.log('Username received:', username);  // إضافة السجل للتأكد من القيمة
  if (!username) {
    return res.status(400).json({
      success: false,
      message: 'No username provided',  // إذا لم يتم توفير اسم المستخدم
    });
  }

  // استعلام SQL للبحث عن المستخدمين الذين يتطابقون مع الاسم
  const query = `
    SELECT 
      username,
      role,
      email,
      phone_number,
      full_name,
      status,
      profile_picture,
      bio
    FROM users
    WHERE username LIKE ? OR full_name LIKE ?;
  `;
  db.query(query, [`%${username}%`, `%${username}%`], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Internal server error', // إذا حدث خطأ في قاعدة البيانات
      });
    }

    console.log('Database query results:', results);  // إضافة سجل لعرض النتائج

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No users found',  // إذا لم يتم العثور على مستخدمين
      });
    }
    return res.status(200).json({
      success: true,
      users: results,  // إرجاع جميع النتائج المطابقة
    });
  });
});

module.exports = router;
