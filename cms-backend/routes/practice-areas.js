const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all practice areas
router.get('/', async (req, res) => {
  try {
    const [practiceAreas] = await db.query('SELECT * FROM practice_areas ORDER BY name');
    res.json(practiceAreas);
  } catch (err) {
    console.error('Error fetching practice areas:', err);
    res.status(500).json({ error: 'Failed to fetch practice areas' });
  }
});

// Get practice area by ID
router.get('/:id', async (req, res) => {
  try {
    const [practiceAreas] = await db.query('SELECT * FROM practice_areas WHERE id = ?', [req.params.id]);
    
    if (practiceAreas.length === 0) {
      return res.status(404).json({ error: 'Practice area not found' });
    }

    res.json(practiceAreas[0]);
  } catch (err) {
    console.error('Error fetching practice area:', err);
    res.status(500).json({ error: 'Failed to fetch practice area' });
  }
});

module.exports = router; 