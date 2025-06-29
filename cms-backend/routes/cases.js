const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all cases
router.get('/', async (req, res) => {
  try {
    const { clientId } = req.query;
    let query = `
      SELECT 
        c.*,
        cl.firstname, cl.middlename, cl.lastname, cl.email, cl.cellphone, cl.workphone, cl.homephone,
        cl.company, cl.jobtitle, cl.address1, cl.address2, cl.city, cl.province, cl.country,
        pa.name as practicearea_name
      FROM cases c
      LEFT JOIN clients cl ON c.clientid = cl.id
      LEFT JOIN practice_areas pa ON c.practicearea_id = pa.id
    `;
    const params = [];

    if (clientId) {
      query += ' WHERE c.clientid = ?';
      params.push(clientId);
    }

    query += ' ORDER BY c.dateopened DESC';
    
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching cases:', err);
    res.status(500).json({ error: err.message });
  }
});

// Search cases by name
router.get('/search', async (req, res) => {
  try {
    const { name } = req.query;
    console.log('Searching for case:', name);

    if (!name) {
      return res.status(400).json({ error: 'Missing required parameter', details: 'name parameter is required' });
    }

    // Search for case by name with related data
    const [cases] = await db.query(
      `SELECT 
        c.*,
        cl.firstname, cl.middlename, cl.lastname, cl.email, cl.cellphone, cl.workphone, cl.homephone,
        cl.company, cl.jobtitle, cl.address1, cl.address2, cl.city, cl.province, cl.country,
        pa.name as practicearea_name,
        GROUP_CONCAT(DISTINCT cn.id, ':', cn.content) as notes,
        GROUP_CONCAT(DISTINCT cc.id, ':', cc.firstname, ':', cc.lastname, ':', cc.role) as contacts,
        GROUP_CONCAT(DISTINCT cd.id, ':', cd.title, ':', cd.filename) as documents
      FROM cases c
      LEFT JOIN clients cl ON c.clientid = cl.id
      LEFT JOIN practice_areas pa ON c.practicearea_id = pa.id
      LEFT JOIN case_notes cn ON c.id = cn.case_id
      LEFT JOIN case_contacts cc ON c.id = cc.case_id
      LEFT JOIN case_documents cd ON c.id = cd.case_id
      WHERE c.casename LIKE ?
      GROUP BY c.id`,
      [`%${name}%`]
    );

    if (cases.length === 0) {
      console.log('No cases found for:', name);
      return res.status(404).json({ error: 'Case not found', details: `No case found with name containing "${name}"` });
    }

    // Process the results
    const caseData = cases.map(caseItem => ({
      ...caseItem,
      client: {
        firstname: caseItem.firstname,
        middlename: caseItem.middlename,
        lastname: caseItem.lastname,
        email: caseItem.email,
        cellphone: caseItem.cellphone,
        workphone: caseItem.workphone,
        homephone: caseItem.homephone,
        company: caseItem.company,
        jobtitle: caseItem.jobtitle,
        address1: caseItem.address1,
        address2: caseItem.address2,
        city: caseItem.city,
        province: caseItem.province,
        country: caseItem.country
      },
      practicearea: caseItem.practicearea_name,
      notes: caseItem.notes ? caseItem.notes.split(',').map(note => {
        const [id, content] = note.split(':');
        return { id, content };
      }) : [],
      contacts: caseItem.contacts ? caseItem.contacts.split(',').map(contact => {
        const [id, firstname, lastname, role] = contact.split(':');
        return { id, firstname, lastname, role };
      }) : [],
      documents: caseItem.documents ? caseItem.documents.split(',').map(doc => {
        const [id, title, filename] = doc.split(':');
        return { id, title, filename };
      }) : []
    }));

    console.log('Found cases:', caseData);
    res.json(caseData[0]); // Return the first matching case
  } catch (error) {
    console.error('Error searching cases:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      sqlState: error.sqlState
    });
    res.status(500).json({ 
      error: 'Failed to search cases', 
      details: error.message,
      code: error.code,
      sqlState: error.sqlState
    });
  }
});

// Get a single case by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        c.*,
        cl.firstname, cl.middlename, cl.lastname, cl.email, cl.cellphone, cl.workphone, cl.homephone,
        cl.company, cl.jobtitle, cl.address1, cl.address2, cl.city, cl.province, cl.country,
        pa.name as practicearea_name
      FROM cases c
      LEFT JOIN clients cl ON c.clientid = cl.id
      LEFT JOIN practice_areas pa ON c.practicearea_id = pa.id
      WHERE c.id = ?
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Case not found' });
    }

    // Transform the data to match frontend expectations
    const caseData = rows[0];
    caseData.practicearea = caseData.practicearea_id;
    caseData.client = {
      firstname: caseData.firstname,
      middlename: caseData.middlename,
      lastname: caseData.lastname,
      email: caseData.email,
      cellphone: caseData.cellphone,
      workphone: caseData.workphone,
      homephone: caseData.homephone,
      company: caseData.company,
      jobtitle: caseData.jobtitle,
      address1: caseData.address1,
      address2: caseData.address2,
      city: caseData.city,
      province: caseData.province,
      country: caseData.country
    };

    res.json(caseData);
  } catch (err) {
    console.error('Error fetching case:', err);
    res.status(500).json({ error: err.message });
  }
});

// Create a new case
router.post('/', async (req, res) => {
  try {
    const caseData = req.body;
    
    // Map practicearea to practicearea_id
    if (caseData.practicearea) {
      const [practiceAreas] = await db.query(
        'SELECT id FROM practice_areas WHERE id = ?',
        [caseData.practicearea]
      );
      
      if (practiceAreas.length > 0) {
        caseData.practicearea_id = practiceAreas[0].id;
      }
      delete caseData.practicearea;
    }

    // Convert date strings to proper format
    if (caseData.dateopened) {
      caseData.dateopened = new Date(caseData.dateopened).toISOString().split('T')[0];
    }
    if (caseData.statuteoflimitations) {
      caseData.statuteoflimitations = new Date(caseData.statuteoflimitations).toISOString().split('T')[0];
    }

    const [result] = await db.query('INSERT INTO cases SET ?', caseData);
    res.json({ id: result.insertId, ...caseData });
  } catch (err) {
    console.error('Error creating case:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update a case
router.put('/:id', async (req, res) => {
  try {
    const caseData = req.body;
    
    // Map practicearea to practicearea_id
    if (caseData.practicearea) {
      const [practiceAreas] = await db.query(
        'SELECT id FROM practice_areas WHERE id = ?',
        [caseData.practicearea]
      );
      
      if (practiceAreas.length > 0) {
        caseData.practicearea_id = practiceAreas[0].id;
      }
      delete caseData.practicearea;
    }

    // Convert date strings to proper format
    if (caseData.dateopened) {
      caseData.dateopened = new Date(caseData.dateopened).toISOString().split('T')[0];
    }
    if (caseData.statuteoflimitations) {
      caseData.statuteoflimitations = new Date(caseData.statuteoflimitations).toISOString().split('T')[0];
    }

    const [result] = await db.query('UPDATE cases SET ? WHERE id = ?', [caseData, req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Case not found' });
    }
    
    res.json({ id: req.params.id, ...caseData });
  } catch (err) {
    console.error('Error updating case:', err);
    res.status(500).json({ error: err.message });
  }
});

// Delete a case
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM cases WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Case not found' });
    }
    
    res.json({ message: 'Case deleted successfully' });
  } catch (err) {
    console.error('Error deleting case:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 