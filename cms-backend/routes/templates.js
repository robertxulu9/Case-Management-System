const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authenticateToken } = require('../middleware/auth');

// Get all templates
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { category } = req.query;
    let query = 'SELECT * FROM document_templates WHERE is_active = true';
    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    const [templates] = await pool.query(query, params);
    res.json(templates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ message: 'Error fetching templates' });
  }
});

// Get template by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const [templates] = await pool.query(
      'SELECT * FROM document_templates WHERE id = ? AND is_active = true',
      [req.params.id]
    );

    if (templates.length === 0) {
      return res.status(404).json({ message: 'Template not found' });
    }

    res.json(templates[0]);
  } catch (error) {
    console.error('Error fetching template:', error);
    res.status(500).json({ message: 'Error fetching template' });
  }
});

// Create new template
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, category, content, variables } = req.body;
    const userId = req.user.id;

    console.log('Creating template with data:', {
      title,
      description,
      category,
      contentLength: content?.length,
      variables
    });

    // Validate required fields
    if (!title || !content || !category) {
      console.error('Missing required fields:', { title, content: !!content, category });
      return res.status(400).json({
        message: 'Missing required fields',
        required: { title, content: !!content, category }
      });
    }

    // Insert the template
    const [result] = await pool.query(
      `INSERT INTO document_templates 
       (title, description, category, content, variables, created_by, updated_by)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        description,
        category,
        content,
        JSON.stringify(variables),
        userId,
        userId
      ]
    );

    console.log('Template created with ID:', result.insertId);

    // Fetch the created template
    const [newTemplate] = await pool.query(
      'SELECT * FROM document_templates WHERE id = ?',
      [result.insertId]
    );

    if (!newTemplate || newTemplate.length === 0) {
      console.error('Failed to retrieve created template:', result.insertId);
      throw new Error('Failed to retrieve created template');
    }

    console.log('Template created successfully:', {
      id: newTemplate[0].id,
      title: newTemplate[0].title,
      category: newTemplate[0].category
    });

    // Return success response
    res.status(201).json({
      message: 'Template created successfully',
      template: newTemplate[0]
    });
  } catch (error) {
    console.error('Error creating template:', {
      message: error.message,
      code: error.code,
      sqlMessage: error.sqlMessage,
      stack: error.stack
    });
    
    // Send more detailed error information
    res.status(500).json({
      message: 'Error creating template',
      error: error.message,
      code: error.code,
      sqlMessage: error.sqlMessage,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Update template
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { title, description, category, content, variables } = req.body;

    await pool.query(
      'UPDATE document_templates SET title = ?, description = ?, category = ?, content = ?, variables = ?, updated_by = ? WHERE id = ?',
      [title, description, category, content, JSON.stringify(variables), req.user.id, req.params.id]
    );

    const [updatedTemplate] = await pool.query(
      'SELECT * FROM document_templates WHERE id = ?',
      [req.params.id]
    );

    if (updatedTemplate.length === 0) {
      return res.status(404).json({ message: 'Template not found' });
    }

    res.json(updatedTemplate[0]);
  } catch (error) {
    console.error('Error updating template:', error);
    res.status(500).json({ message: 'Error updating template' });
  }
});

// Delete template (soft delete)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await pool.query(
      'UPDATE document_templates SET is_active = false, updated_by = ? WHERE id = ?',
      [req.user.id, req.params.id]
    );

    res.json({ message: 'Template deleted successfully' });
  } catch (error) {
    console.error('Error deleting template:', error);
    res.status(500).json({ message: 'Error deleting template' });
  }
});

// Generate document from template
router.post('/:id/generate', authenticateToken, async (req, res) => {
  try {
    const { variables } = req.body;
    
    if (!variables || typeof variables !== 'object') {
      return res.status(400).json({ 
        message: 'Invalid variables format',
        error: 'Variables must be provided as an object'
      });
    }

    const [templates] = await pool.query(
      'SELECT * FROM document_templates WHERE id = ? AND is_active = true',
      [req.params.id]
    );

    if (templates.length === 0) {
      return res.status(404).json({ 
        message: 'Template not found',
        error: `Template with ID ${req.params.id} not found`
      });
    }

    const template = templates[0];
    
    if (!template.content) {
      return res.status(400).json({
        message: 'Template content is empty',
        error: 'Template has no content to generate from'
      });
    }

    let content = template.content;

    try {
      // Replace variables in the template
      Object.entries(variables).forEach(([key, value]) => {
        if (value === null || value === undefined) {
          value = '';
        }
        
        // Escape special characters in the key for the regex
        const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`{${escapedKey}}`, 'g');
        
        // Convert value to string and escape HTML special characters
        const stringValue = String(value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;');
        
        content = content.replace(regex, stringValue);
      });
    } catch (replaceError) {
      console.error('Error replacing variables:', replaceError);
      console.error('Template content:', content);
      console.error('Variables:', variables);
      return res.status(500).json({
        message: 'Error replacing variables in template',
        error: replaceError.message
      });
    }

    // Ensure content is properly formatted
    if (!content) {
      return res.status(400).json({ 
        message: 'Generated content is empty',
        error: 'Template content could not be generated'
      });
    }

    res.json({ 
      content,
      title: template.title,
      category: template.category
    });
  } catch (error) {
    console.error('Error generating document:', error);
    res.status(500).json({ 
      message: 'Error generating document',
      error: error.message || 'An unexpected error occurred'
    });
  }
});

module.exports = router; 