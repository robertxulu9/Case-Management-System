const express = require('express');
const router = express.Router();
const db = require('../db');

// Get timeline events for a case
router.get('/', async (req, res) => {
  try {
    const { caseId } = req.query;
    if (!caseId) {
      return res.status(400).json({ error: 'Case ID is required' });
    }

    const [rows] = await db.query(`
      SELECT * FROM timeline_events 
      WHERE caseid = ? 
      ORDER BY created_at DESC
    `, [caseId]);
    
    res.json(rows);
  } catch (err) {
    console.error('Error fetching timeline events:', err);
    res.status(500).json({ error: err.message });
  }
});

// Create a new timeline event
router.post('/', async (req, res) => {
  try {
    const { caseId, eventType, description } = req.body;
    
    if (!caseId || !eventType || !description) {
      return res.status(400).json({ error: 'Case ID, event type, and description are required' });
    }

    const [result] = await db.query(
      'INSERT INTO timeline_events (caseid, event_type, description) VALUES (?, ?, ?)',
      [caseId, eventType, description]
    );

    const [newEvent] = await db.query(
      'SELECT * FROM timeline_events WHERE id = ?',
      [result.insertId]
    );

    res.json(newEvent[0]);
  } catch (err) {
    console.error('Error creating timeline event:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update a timeline event
router.put('/:id', async (req, res) => {
  try {
    const { eventType, description } = req.body;
    
    if (!eventType || !description) {
      return res.status(400).json({ error: 'Event type and description are required' });
    }

    const [result] = await db.query(
      'UPDATE timeline_events SET event_type = ?, description = ? WHERE id = ?',
      [eventType, description, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Timeline event not found' });
    }

    const [updatedEvent] = await db.query(
      'SELECT * FROM timeline_events WHERE id = ?',
      [req.params.id]
    );

    res.json(updatedEvent[0]);
  } catch (err) {
    console.error('Error updating timeline event:', err);
    res.status(500).json({ error: err.message });
  }
});

// Delete a timeline event
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query(
      'DELETE FROM timeline_events WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Timeline event not found' });
    }

    res.json({ message: 'Timeline event deleted successfully' });
  } catch (err) {
    console.error('Error deleting timeline event:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 