const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../db');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();

const addStoreValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Invalid email format'),
  body('address').isLength({ max: 400 }).withMessage('Address max 400 characters'),
  body('owner_id').isInt().withMessage('Owner ID is required')
];

router.post('/', authorize('SYSTEM_ADMIN'), addStoreValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, address, owner_id } = req.body;
  try {
    const existing = await db.query('SELECT * FROM stores WHERE email = $1', [email]);
    if (existing.rows.length > 0) return res.status(400).json({ error: 'Email already in use' });

    const ownerCheck = await db.query('SELECT * FROM users WHERE id = $1 AND role = $2', [owner_id, 'STORE_OWNER']);
    if (ownerCheck.rows.length === 0) return res.status(400).json({ error: 'Invalid owner ID or user is not a STORE_OWNER' });

    const result = await db.query(
      'INSERT INTO stores (name, email, address, owner_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, address, owner_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', authenticate, async (req, res) => {
  try {
    let query = `
      SELECT s.id, s.name, s.email, s.address, 
             COALESCE(AVG(r.rating), 0) as overall_rating
    `;
    if (req.user.role === 'NORMAL_USER') {
      query += `, (SELECT rating FROM ratings WHERE store_id = s.id AND user_id = $1) as user_rating `;
    }
    
    query += `
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      GROUP BY s.id
      ORDER BY s.name ASC
    `;

    const params = req.user.role === 'NORMAL_USER' ? [req.user.id] : [];
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
