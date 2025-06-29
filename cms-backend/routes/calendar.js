const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authenticateToken } = require('../middleware/auth');

// Get all calendar items
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [items] = await pool.query(
      `SELECT ci.*, 
        u.firstname as lawyer_firstname,
        u.lastname as lawyer_lastname,
        c.casenumber,
        c.casename as case_title
       FROM calendar_items ci
       LEFT JOIN users u ON ci.lawyer_id = u.id
       LEFT JOIN cases c ON ci.case_id = c.id
       ORDER BY ci.start ASC`
    );
    res.json(items);
  } catch (error) {
    console.error('Error fetching calendar items:', error);
    res.status(500).json({ message: 'Error fetching calendar items' });
  }
});

// Get calendar item by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const [items] = await pool.query(
      `SELECT ci.*, 
        u.firstname as lawyer_firstname,
        u.lastname as lawyer_lastname,
        c.casenumber,
        c.casename as case_title
       FROM calendar_items ci
       LEFT JOIN users u ON ci.lawyer_id = u.id
       LEFT JOIN cases c ON ci.case_id = c.id
       WHERE ci.id = ?`,
      [req.params.id]
    );

    if (items.length === 0) {
      return res.status(404).json({ message: 'Calendar item not found' });
    }

    res.json(items[0]);
  } catch (error) {
    console.error('Error fetching calendar item:', error);
    res.status(500).json({ message: 'Error fetching calendar item' });
  }
});

// Create new calendar item
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      title,
      start,
      end,
      description,
      lawyerId,
      type,
      caseId,
      priority,
      location,
      completed
    } = req.body;

    // Validate required fields
    if (!title || !start || !end) {
      return res.status(400).json({ message: 'Title, start, and end are required' });
    }

    // If lawyer is assigned, verify they exist
    if (lawyerId) {
      const [users] = await pool.query(
        'SELECT id FROM users WHERE id = ? AND is_active = true',
        [lawyerId]
      );
      if (users.length === 0) {
        return res.status(400).json({ message: 'Selected lawyer not found or inactive' });
      }
    }

    // If case is assigned, verify it exists
    if (caseId) {
      const [cases] = await pool.query(
        'SELECT id FROM cases WHERE id = ?',
        [caseId]
      );
      if (cases.length === 0) {
        return res.status(400).json({ message: 'Selected case not found' });
      }
    }

    const [result] = await pool.query(
      `INSERT INTO calendar_items 
       (title, start, end, description, lawyer_id, type, case_id, priority, location, completed, user_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, start, end, description, lawyerId, type, caseId, priority, location, completed || false, req.user.id]
    );

    const [newItem] = await pool.query(
      `SELECT ci.*, 
        u.firstname as lawyer_firstname,
        u.lastname as lawyer_lastname,
        c.casenumber,
        c.casename as case_title
       FROM calendar_items ci
       LEFT JOIN users u ON ci.lawyer_id = u.id
       LEFT JOIN cases c ON ci.case_id = c.id
       WHERE ci.id = ?`,
      [result.insertId]
    );

    res.status(201).json(newItem[0]);
  } catch (error) {
    console.error('Error creating calendar item:', error);
    res.status(500).json({ message: 'Error creating calendar item' });
  }
});

// Update calendar item
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      start,
      end,
      description,
      lawyerId,
      type,
      caseId,
      priority,
      location,
      completed
    } = req.body;

    // Validate required fields
    if (!title || !start || !end) {
      return res.status(400).json({ message: 'Title, start, and end are required' });
    }

    // If lawyer is assigned, verify they exist
    if (lawyerId) {
      const [users] = await pool.query(
        'SELECT id FROM users WHERE id = ? AND is_active = true',
        [lawyerId]
      );
      if (users.length === 0) {
        return res.status(400).json({ message: 'Selected lawyer not found or inactive' });
      }
    }

    // If case is assigned, verify it exists
    if (caseId) {
      const [cases] = await pool.query(
        'SELECT id FROM cases WHERE id = ?',
        [caseId]
      );
      if (cases.length === 0) {
        return res.status(400).json({ message: 'Selected case not found' });
      }
    }

    await pool.query(
      `UPDATE calendar_items 
       SET title = ?,
           start = ?,
           end = ?,
           description = ?,
           lawyer_id = ?,
           type = ?,
           case_id = ?,
           priority = ?,
           location = ?,
           completed = ?,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [title, start, end, description, lawyerId, type, caseId, priority, location, completed, id]
    );

    const [updatedItem] = await pool.query(
      `SELECT ci.*, 
        u.firstname as lawyer_firstname,
        u.lastname as lawyer_lastname,
        c.casenumber,
        c.casename as case_title
       FROM calendar_items ci
       LEFT JOIN users u ON ci.lawyer_id = u.id
       LEFT JOIN cases c ON ci.case_id = c.id
       WHERE ci.id = ?`,
      [id]
    );

    if (!updatedItem[0]) {
      return res.status(404).json({ message: 'Calendar item not found' });
    }

    res.json(updatedItem[0]);
  } catch (error) {
    console.error('Error updating calendar item:', error);
    res.status(500).json({ message: 'Error updating calendar item' });
  }
});

// Delete calendar item
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(
      'DELETE FROM calendar_items WHERE id = ?',
      [id]
    );
    res.json({ message: 'Calendar item deleted successfully' });
  } catch (error) {
    console.error('Error deleting calendar item:', error);
    res.status(500).json({ message: 'Error deleting calendar item' });
  }
});

module.exports = router; 