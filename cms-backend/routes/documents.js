const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pool = require('../db');
const { authenticateToken } = require('../middleware/auth');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Create unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Get all client documents
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { clientId } = req.query;
    let query = `
      SELECT cd.*, c.name as client_name, dt.title as template_title
      FROM client_documents cd
      LEFT JOIN clients c ON cd.client_id = c.id
      LEFT JOIN document_templates dt ON cd.template_id = dt.id
      WHERE cd.is_active = true
    `;
    const params = [];

    if (clientId) {
      query += ' AND cd.client_id = ?';
      params.push(clientId);
    }

    query += ' ORDER BY cd.created_at DESC';

    const [documents] = await pool.query(query, params);
    res.json(documents);
  } catch (error) {
    console.error('Error fetching client documents:', error);
    res.status(500).json({ message: 'Error fetching client documents' });
  }
});

// Get client document by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const [documents] = await pool.query(
      `SELECT cd.*, c.name as client_name, dt.title as template_title
       FROM client_documents cd
       LEFT JOIN clients c ON cd.client_id = c.id
       LEFT JOIN document_templates dt ON cd.template_id = dt.id
       WHERE cd.id = ? AND cd.is_active = true`,
      [req.params.id]
    );

    if (documents.length === 0) {
      return res.status(404).json({ message: 'Client document not found' });
    }

    res.json(documents[0]);
  } catch (error) {
    console.error('Error fetching client document:', error);
    res.status(500).json({ message: 'Error fetching client document' });
  }
});

// Create new client document
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, content, clientId, templateId, status = 'sent', sentDate } = req.body;
    const userId = req.user.id;

    // Convert IDs to numbers
    const clientIdNum = parseInt(clientId, 10);
    const templateIdNum = parseInt(templateId, 10);

    console.log('Creating document with data:', {
      title,
      contentLength: content?.length,
      clientId: clientIdNum,
      templateId: templateIdNum,
      status,
      sentDate,
      userId,
      clientIdType: typeof clientIdNum,
      templateIdType: typeof templateIdNum
    });

    // Validate required fields
    if (!title || !content || !clientIdNum || !templateIdNum) {
      console.error('Missing or invalid required fields:', { 
        title, 
        content: !!content, 
        clientId: clientIdNum, 
        templateId: templateIdNum 
      });
      return res.status(400).json({
        message: 'Missing or invalid required fields',
        required: { 
          title, 
          content: !!content, 
          clientId: clientIdNum, 
          templateId: templateIdNum 
        }
      });
    }

    // First, verify that the client exists
    const [clients] = await pool.query('SELECT id FROM clients WHERE id = ?', [clientIdNum]);
    if (clients.length === 0) {
      console.error('Client not found:', clientIdNum);
      return res.status(400).json({ message: 'Client not found' });
    }

    // Then, verify that the template exists
    const [templates] = await pool.query('SELECT id FROM document_templates WHERE id = ?', [templateIdNum]);
    if (templates.length === 0) {
      console.error('Template not found:', templateIdNum);
      return res.status(400).json({ message: 'Template not found' });
    }

    // Insert the document
    const [result] = await pool.query(
      `INSERT INTO client_documents 
       (title, content, client_id, template_id, status, sent_date, created_by, updated_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, content, clientIdNum, templateIdNum, status, sentDate, userId, userId]
    );

    console.log('Document created with ID:', result.insertId);

    // Fetch the created document with related data
    const [newDocument] = await pool.query(
      `SELECT cd.*, c.name as client_name, dt.title as template_title
       FROM client_documents cd
       LEFT JOIN clients c ON cd.client_id = c.id
       LEFT JOIN document_templates dt ON cd.template_id = dt.id
       WHERE cd.id = ?`,
      [result.insertId]
    );

    if (!newDocument || newDocument.length === 0) {
      console.error('Failed to retrieve created document:', result.insertId);
      throw new Error('Failed to retrieve created document');
    }

    console.log('Document created successfully:', {
      id: newDocument[0].id,
      title: newDocument[0].title,
      clientName: newDocument[0].client_name,
      templateTitle: newDocument[0].template_title
    });

    // Return success response
    res.status(201).json({
      message: 'Document created successfully',
      document: newDocument[0]
    });
  } catch (error) {
    console.error('Error creating client document:', {
      message: error.message,
      code: error.code,
      sqlMessage: error.sqlMessage,
      stack: error.stack
    });
    
    // Send more detailed error information
    res.status(500).json({
      message: 'Error creating client document',
      error: error.message,
      code: error.code,
      sqlMessage: error.sqlMessage,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Update client document
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { title, content, status } = req.body;
    const userId = req.user.id;

    const [result] = await pool.query(
      `UPDATE client_documents 
       SET title = ?, content = ?, status = ?, updated_by = ?
       WHERE id = ? AND is_active = true`,
      [title, content, status, userId, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Client document not found' });
    }

    const [updatedDocument] = await pool.query(
      `SELECT cd.*, c.name as client_name, dt.title as template_title
       FROM client_documents cd
       LEFT JOIN clients c ON cd.client_id = c.id
       LEFT JOIN document_templates dt ON cd.template_id = dt.id
       WHERE cd.id = ?`,
      [req.params.id]
    );

    res.json(updatedDocument[0]);
  } catch (error) {
    console.error('Error updating client document:', error);
    res.status(500).json({ message: 'Error updating client document' });
  }
});

// Delete client document (soft delete)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const [result] = await pool.query(
      'UPDATE client_documents SET is_active = false WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Client document not found' });
    }

    res.json({ message: 'Client document deleted successfully' });
  } catch (error) {
    console.error('Error deleting client document:', error);
    res.status(500).json({ message: 'Error deleting client document' });
  }
});

// Get all documents for a case
router.get('/case/:caseId', async (req, res) => {
  try {
    const { caseId } = req.params;
    console.log('Fetching documents for case:', caseId);

    // Verify case exists
    const [caseResult] = await pool.query('SELECT id FROM cases WHERE id = ?', [caseId]);
    if (caseResult.length === 0) {
      console.error('Case not found:', caseId);
      return res.status(404).json({ error: 'Case not found', details: `Case with ID ${caseId} does not exist` });
    }

    // Get all documents for the case
    const [documents] = await pool.query(
      'SELECT * FROM case_documents WHERE case_id = ? ORDER BY created_at DESC',
      [caseId]
    );

    console.log('Found documents:', documents);
    res.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      sqlState: error.sqlState
    });
    res.status(500).json({ 
      error: 'Failed to fetch documents', 
      details: error.message,
      code: error.code,
      sqlState: error.sqlState
    });
  }
});

// Upload a new document
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    console.log('Upload request received:', {
      body: req.body,
      file: req.file,
      headers: req.headers
    });

    const { caseId, title, description } = req.body;
    const file = req.file;

    if (!caseId || !file) {
      console.error('Missing required fields:', { caseId, file });
      return res.status(400).json({ error: 'Missing required fields', details: 'caseId and file are required' });
    }

    // Verify case exists
    const [caseResult] = await pool.query('SELECT id FROM cases WHERE id = ?', [caseId]);
    if (caseResult.length === 0) {
      console.error('Case not found:', caseId);
      return res.status(404).json({ error: 'Case not found', details: `Case with ID ${caseId} does not exist` });
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Insert document record
    const [result] = await pool.query(
      'INSERT INTO case_documents (case_id, title, description, filename, filepath, filesize, filetype) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        caseId,
        title || file.originalname,
        description || `Uploaded ${file.originalname}`,
        file.originalname,
        file.path,
        file.size,
        file.mimetype
      ]
    );

    console.log('Document record created:', result);

    // Create timeline event
    await pool.query(
      'INSERT INTO timeline_events (caseid, event_type, description) VALUES (?, ?, ?)',
      [caseId, 'document_upload', `Document "${file.originalname}" uploaded`]
    );

    // Get the new document
    const [newDoc] = await pool.query('SELECT * FROM case_documents WHERE id = ?', [result.insertId]);
    console.log('New document:', newDoc[0]);

    res.json(newDoc[0]);
  } catch (error) {
    console.error('Error in document upload:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      sqlState: error.sqlState
    });
    res.status(500).json({ 
      error: 'Failed to upload document', 
      details: error.message,
      code: error.code,
      sqlState: error.sqlState
    });
  }
});

// Delete a document
router.delete('/:id', async (req, res) => {
  try {
    const documentId = req.params.id;
    console.log('Deleting document:', documentId);

    // Get document details first
    const [documents] = await pool.query('SELECT * FROM case_documents WHERE id = ?', [documentId]);
    if (documents.length === 0) {
      console.error('Document not found:', documentId);
      return res.status(404).json({ error: 'Document not found', details: `Document with ID ${documentId} does not exist` });
    }

    const document = documents[0];

    // Delete the physical file
    try {
      if (fs.existsSync(document.filepath)) {
        fs.unlinkSync(document.filepath);
        console.log('File deleted:', document.filepath);
      } else {
        console.warn('File not found:', document.filepath);
      }
    } catch (fileError) {
      console.error('Error deleting file:', fileError);
      // Continue with database deletion even if file deletion fails
    }

    // Delete from database
    await pool.query('DELETE FROM case_documents WHERE id = ?', [documentId]);
    console.log('Document record deleted:', documentId);

    // Create timeline event
    await pool.query(
      'INSERT INTO timeline_events (caseid, event_type, description) VALUES (?, ?, ?)',
      [document.case_id, 'document_delete', `Document "${document.filename}" deleted`]
    );

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error in document deletion:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      sqlState: error.sqlState
    });
    res.status(500).json({ 
      error: 'Failed to delete document', 
      details: error.message,
      code: error.code,
      sqlState: error.sqlState
    });
  }
});

// Download a document
router.get('/:id/download', async (req, res) => {
  try {
    const { id } = req.params;

    const [document] = await pool.query(
      'SELECT * FROM case_documents WHERE id = ?',
      [id]
    );

    if (!document.length) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.download(document[0].filepath, document[0].filename);
  } catch (error) {
    console.error('Error downloading document:', error);
    res.status(500).json({ error: 'Failed to download document' });
  }
});

module.exports = router; 