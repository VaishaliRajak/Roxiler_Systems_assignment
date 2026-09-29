const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../db');
const { authenticate, authorize } = require('../middleware/auth');
const router = express.Router();

router.post('/', authorize('NORMAL_USER'), [
  body('store_id').isInt(),
  body('rating').isInt({ min: 1, max: 5 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { store_id, rating } = req.body;
  const user_id = req.user.id;

  try {
    const existing = await db.query('SELECT * FROM ratings WHERE store_id = $1 AND user_id = $2', [store_id, user_id]);
    if (existing.rows.length > 0) {
      const updated = await db.query(
        'UPDATE ratings SET rating = $1 WHERE store_id = $2 AND user_id = $3 RETURNING *',
        [rating, store_id, user_id]
      );
      return res.json(updated.rows[0]);
    } else {
      const inserted = await db.query(
        'INSERT INTO ratings (store_id, user_id, rating) VALUES ($1, $2, $3) RETURNING *',
        [store_id, user_id, rating]
      );
      return res.status(201).json(inserted.rows[0]);
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/dashboard', authorize('STORE_OWNER'), async (req, res) => {
  try {
    const store = await db.query('SELECT id FROM stores WHERE owner_id = $1', [req.user.id]);
    if (store.rows.length === 0) return res.status(404).json({ error: 'No store found for this owner' });
    const store_id = store.rows[0].id;

    const avgRes = await db.query('SELECT COALESCE(AVG(rating), 0) as average_rating FROM ratings WHERE store_id = $1', [store_id]);
    const average_rating = avgRes.rows[0].average_rating;

    const usersRes = await db.query(`
      SELECT u.name, u.email, r.rating
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      WHERE r.store_id = $1
      ORDER BY u.name ASC
    `, [store_id]);

    res.json({ average_rating, ratings: usersRes.rows });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
