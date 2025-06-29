const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all contacts
router.get('/', async (req, res) => {
  try {
    const { caseId } = req.query;
    let query = 'SELECT * FROM case_contacts';
    const params = [];

    if (caseId) {
      query += ' WHERE case_id = ?';
      params.push(caseId);
    }

    query += ' ORDER BY lastname ASC';
    
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching contacts:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get a single contact by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM case_contacts WHERE id = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching contact:', err);
    res.status(500).json({ error: err.message });
  }
});

// Create a new contact
router.post('/', async (req, res) => {
  try {
    const contactData = req.body;
    console.log('Received contact data:', contactData);
    
    // Validate required fields
    if (!contactData.case_id) {
      console.log('Missing case_id');
      return res.status(400).json({ error: 'case_id is required' });
    }
    if (!contactData.firstname) {
      console.log('Missing firstname');
      return res.status(400).json({ error: 'firstname is required' });
    }
    if (!contactData.lastname) {
      console.log('Missing lastname');
      return res.status(400).json({ error: 'lastname is required' });
    }
    if (!contactData.role) {
      console.log('Missing role');
      return res.status(400).json({ error: 'role is required' });
    }

    // Clean and prepare the data
    const cleanContactData = {
      case_id: contactData.case_id,
      firstname: contactData.firstname.trim(),
      middlename: contactData.middlename ? contactData.middlename.trim() : null,
      lastname: contactData.lastname.trim(),
      role: contactData.role.trim(),
      email: contactData.email ? contactData.email.trim() : null,
      phone: contactData.phone ? contactData.phone.trim() : null,
      company: contactData.company ? contactData.company.trim() : null,
      jobtitle: contactData.jobtitle ? contactData.jobtitle.trim() : null,
      notes: contactData.notes ? contactData.notes.trim() : null
    };

    console.log('Attempting to insert contact with cleaned data:', cleanContactData);

    // First verify the case exists
    const [caseRows] = await db.query('SELECT id FROM cases WHERE id = ?', [cleanContactData.case_id]);
    if (caseRows.length === 0) {
      console.log('Case not found:', cleanContactData.case_id);
      return res.status(400).json({ error: 'Invalid case_id: Case not found' });
    }

    const [result] = await db.query('INSERT INTO case_contacts SET ?', cleanContactData);
    console.log('Insert result:', result);
    
    // Get the created contact
    const [rows] = await db.query('SELECT * FROM case_contacts WHERE id = ?', [result.insertId]);
    console.log('Retrieved created contact:', rows[0]);
    
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Detailed error creating contact:', err);
    console.error('Error stack:', err.stack);
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ error: 'Invalid case_id: Case not found' });
    }
    res.status(500).json({ error: err.message });
  }
});

// Update a contact
router.put('/:id', async (req, res) => {
  try {
    const contactData = req.body;
    
    const [result] = await db.query('UPDATE case_contacts SET ? WHERE id = ?', [contactData, req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    // Get the updated contact
    const [rows] = await db.query('SELECT * FROM case_contacts WHERE id = ?', [req.params.id]);
    
    res.json(rows[0]);
  } catch (err) {
    console.error('Error updating contact:', err);
    res.status(500).json({ error: err.message });
  }
});

// Delete a contact
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM case_contacts WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    res.json({ message: 'Contact deleted successfully' });
  } catch (err) {
    console.error('Error deleting contact:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 