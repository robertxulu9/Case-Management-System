const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all notes for a case
router.get('/', async (req, res) => {
  try {
    const { caseId, case_id } = req.query;
    const caseIdToUse = caseId || case_id;
    
    if (!caseIdToUse) {
      return res.status(400).json({ error: 'caseId is required' });
    }

    const [rows] = await db.query(
      'SELECT * FROM case_notes WHERE case_id = ? ORDER BY created_at DESC',
      [caseIdToUse]
    );
    res.json(rows);
  } catch (err) {
    console.error('Error fetching notes:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get a single note by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM case_notes WHERE id = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching note:', err);
    res.status(500).json({ error: err.message });
  }
});

// Create a new note
router.post('/', async (req, res) => {
  try {
    const noteData = req.body;
    console.log('Received note data:', noteData);
    
    // Validate required fields
    if (!noteData.case_id) {
      return res.status(400).json({ error: 'case_id is required' });
    }
    if (!noteData.content) {
      return res.status(400).json({ error: 'content is required' });
    }

    // Verify the case exists
    const [caseRows] = await db.query('SELECT id FROM cases WHERE id = ?', [noteData.case_id]);
    if (caseRows.length === 0) {
      return res.status(400).json({ error: 'Invalid case_id: Case not found' });
    }

    const [result] = await db.query('INSERT INTO case_notes SET ?', noteData);
    
    // Get the created note
    const [rows] = await db.query('SELECT * FROM case_notes WHERE id = ?', [result.insertId]);
    
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error creating note:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update a note
router.put('/:id', async (req, res) => {
  try {
    const noteData = req.body;
    
    if (!noteData.content) {
      return res.status(400).json({ error: 'content is required' });
    }

    const [result] = await db.query('UPDATE case_notes SET ? WHERE id = ?', [noteData, req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    // Get the updated note
    const [rows] = await db.query('SELECT * FROM case_notes WHERE id = ?', [req.params.id]);
    
    res.json(rows[0]);
  } catch (err) {
    console.error('Error updating note:', err);
    res.status(500).json({ error: err.message });
  }
});

// Delete a note
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM case_notes WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    res.json({ message: 'Note deleted successfully' });
  } catch (err) {
    console.error('Error deleting note:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 