const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authenticateToken } = require('../middleware/auth');

// Get all active lawyers
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [lawyers] = await pool.query(
      `SELECT l.*, 
        u.id as user_id,
        u.email,
        u.firstname,
        u.lastname,
        u.role,
        u.is_active as user_active
       FROM lawyers l
       JOIN users u ON l.user_id = u.id
       WHERE l.is_active = true AND u.is_active = true
       ORDER BY u.firstname, u.lastname ASC`
    );
    res.json(lawyers);
  } catch (error) {
    console.error('Error fetching lawyers:', error);
    res.status(500).json({ message: 'Error fetching lawyers' });
  }
});

// Get lawyer by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const [lawyers] = await pool.query(
      `SELECT l.*, 
        u.id as user_id,
        u.email,
        u.firstname,
        u.lastname,
        u.role,
        u.is_active as user_active
       FROM lawyers l
       JOIN users u ON l.user_id = u.id
       WHERE l.id = ? AND l.is_active = true AND u.is_active = true`,
      [req.params.id]
    );

    if (lawyers.length === 0) {
      return res.status(404).json({ message: 'Lawyer not found' });
    }

    res.json(lawyers[0]);
  } catch (error) {
    console.error('Error fetching lawyer:', error);
    res.status(500).json({ message: 'Error fetching lawyer' });
  }
});

// Create new lawyer
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      userId,
      barNumber,
      specialization,
      yearsOfExperience
    } = req.body;

    // Check if user exists and is active
    const [users] = await pool.query(
      'SELECT id FROM users WHERE id = ? AND is_active = true',
      [userId]
    );
    if (users.length === 0) {
      return res.status(400).json({ message: 'User not found or inactive' });
    }

    // Check if lawyer already exists for this user
    const [existingLawyers] = await pool.query(
      'SELECT id FROM lawyers WHERE user_id = ? AND is_active = true',
      [userId]
    );
    if (existingLawyers.length > 0) {
      return res.status(400).json({ message: 'Lawyer profile already exists for this user' });
    }

    const [result] = await pool.query(
      `INSERT INTO lawyers 
       (user_id, bar_number, specialization, years_of_experience)
       VALUES (?, ?, ?, ?)`,
      [
        userId,
        barNumber,
        specialization,
        yearsOfExperience
      ]
    );

    const [newLawyer] = await pool.query(
      `SELECT l.*, 
        u.id as user_id,
        u.email,
        u.firstname,
        u.lastname,
        u.role,
        u.is_active as user_active
       FROM lawyers l
       JOIN users u ON l.user_id = u.id
       WHERE l.id = ?`,
      [result.insertId]
    );

    res.status(201).json(newLawyer[0]);
  } catch (error) {
    console.error('Error creating lawyer:', error);
    res.status(500).json({ message: 'Error creating lawyer' });
  }
});

// Update lawyer
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      barNumber,
      specialization,
      yearsOfExperience
    } = req.body;

    await pool.query(
      `UPDATE lawyers 
       SET bar_number = ?,
           specialization = ?,
           years_of_experience = ?
       WHERE id = ?`,
      [
        barNumber,
        specialization,
        yearsOfExperience,
        id
      ]
    );

    const [updatedLawyer] = await pool.query(
      `SELECT l.*, 
        u.id as user_id,
        u.email,
        u.firstname,
        u.lastname,
        u.role,
        u.is_active as user_active
       FROM lawyers l
       JOIN users u ON l.user_id = u.id
       WHERE l.id = ?`,
      [id]
    );

    if (!updatedLawyer[0]) {
      return res.status(404).json({ message: 'Lawyer not found' });
    }

    res.json(updatedLawyer[0]);
  } catch (error) {
    console.error('Error updating lawyer:', error);
    res.status(500).json({ message: 'Error updating lawyer' });
  }
});

// Delete lawyer (soft delete)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(
      'UPDATE lawyers SET is_active = false WHERE id = ?',
      [id]
    );
    res.json({ message: 'Lawyer deleted successfully' });
  } catch (error) {
    console.error('Error deleting lawyer:', error);
    res.status(500).json({ message: 'Error deleting lawyer' });
  }
});

module.exports = router; 