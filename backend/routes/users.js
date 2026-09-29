const express = require('express');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const db = require('../db');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();

const addUserValidation = [
  body('name').isLength({ min: 20, max: 60 }).withMessage('Name must be between 20 and 60 characters'),
  body('email').isEmail().withMessage('Invalid email format'),
  body('address').isLength({ max: 400 }).withMessage('Address max 400 characters'),
  body('password')
    .isLength({ min: 8, max: 16 }).withMessage('Password must be 8-16 characters')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[\W_]/).withMessage('Password must contain at least one special character'),
  body('role').isIn(['SYSTEM_ADMIN', 'NORMAL_USER', 'STORE_OWNER']).withMessage('Invalid role')
];

router.post('/', authorize('SYSTEM_ADMIN'), addUserValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password, address, role } = req.body;
  try {
    const existing = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) return res.status(400).json({ error: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      'INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role, address',
      [name, email, hashedPassword, address, role]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', authorize('SYSTEM_ADMIN'), async (req, res) => {
  try {
    const result = await db.query(`
      SELECT u.id, u.name, u.email, u.address, u.role, 
             COALESCE(AVG(r.rating), 0) as store_rating
      FROM users u
      LEFT JOIN stores s ON u.id = s.owner_id AND u.role = 'STORE_OWNER'
      LEFT JOIN ratings r ON s.id = r.store_id
      GROUP BY u.id
      ORDER BY u.name ASC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/dashboard', authorize('SYSTEM_ADMIN'), async (req, res) => {
  try {
    const usersCount = await db.query('SELECT COUNT(*) FROM users');
    const storesCount = await db.query('SELECT COUNT(*) FROM stores');
    const ratingsCount = await db.query('SELECT COUNT(*) FROM ratings');
    
    res.json({
      totalUsers: parseInt(usersCount.rows[0].count, 10),
      totalStores: parseInt(storesCount.rows[0].count, 10),
      totalRatings: parseInt(ratingsCount.rows[0].count, 10),
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
