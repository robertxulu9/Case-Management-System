const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all clients
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM clients');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single client by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM clients WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new client
router.post('/', async (req, res) => {
  try {
    const client = req.body;
    const [result] = await db.query('INSERT INTO clients SET ?', client);
    res.json({ id: result.insertId, ...client });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a client
router.put('/:id', async (req, res) => {
  try {
    const clientData = req.body;
    const [result] = await db.query('UPDATE clients SET ? WHERE id = ?', [clientData, req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    res.json({ id: req.params.id, ...clientData });
  } catch (err) {
    console.error('Error updating client:', err);
    res.status(500).json({ error: err.message });
  }
});

// Delete a client
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM clients WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }
    
    res.json({ message: 'Client deleted successfully' });
  } catch (err) {
    console.error('Error deleting client:', err);
    res.status(500).json({ error: err.message });
  }
});

// Add more endpoints (update, delete, get by id) as needed

module.exports = router;
