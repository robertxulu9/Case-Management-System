const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const db = require('../db');

// Get user profile (current user)
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, email, firstname, lastname, role, is_active, created_at, last_login FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(users[0]);
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get all users (admin only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin role required.' });
    }

    const [users] = await db.query(
      'SELECT id, email, firstname, lastname, role, is_active, created_at, last_login FROM users ORDER BY created_at DESC'
    );

    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get user by ID (admin only)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin or requesting their own profile
    if (req.user.role !== 'admin' && req.user.id !== parseInt(req.params.id)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const [users] = await db.query(
      'SELECT id, email, firstname, lastname, role, is_active, created_at, last_login FROM users WHERE id = ?',
      [req.params.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(users[0]);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update user profile
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin or updating their own profile
    if (req.user.role !== 'admin' && req.user.id !== parseInt(req.params.id)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { firstname, lastname, email } = req.body;
    const allowedFields = { firstname, lastname, email };
    
    // Remove undefined fields
    Object.keys(allowedFields).forEach(key => 
      allowedFields[key] === undefined && delete allowedFields[key]
    );

    if (Object.keys(allowedFields).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    // Check if email is being updated and if it's already taken
    if (email) {
      const [existingUsers] = await db.query(
        'SELECT id FROM users WHERE email = ? AND id != ?',
        [email, req.params.id]
      );
      if (existingUsers.length > 0) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }

    const setClause = Object.keys(allowedFields).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(allowedFields), req.params.id];

    await db.query(
      `UPDATE users SET ${setClause} WHERE id = ?`,
      values
    );

    // Fetch updated user
    const [users] = await db.query(
      'SELECT id, email, firstname, lastname, role, is_active, created_at, last_login FROM users WHERE id = ?',
      [req.params.id]
    );

    res.json(users[0]);
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update user role (admin only)
router.put('/:id/role', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin role required.' });
    }

    const { role } = req.body;
    
    if (!role || !['admin', 'user', 'lawyer'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be admin, user, or lawyer.' });
    }

    await db.query(
      'UPDATE users SET role = ? WHERE id = ?',
      [role, req.params.id]
    );

    // Fetch updated user
    const [users] = await db.query(
      'SELECT id, email, firstname, lastname, role, is_active, created_at, last_login FROM users WHERE id = ?',
      [req.params.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(users[0]);
  } catch (err) {
    console.error('Error updating user role:', err);
    res.status(500).json({ error: err.message });
  }
});

// Deactivate/Activate user (admin only)
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin role required.' });
    }

    const { is_active } = req.body;
    
    if (typeof is_active !== 'boolean') {
      return res.status(400).json({ error: 'is_active must be a boolean value' });
    }

    // Prevent admin from deactivating themselves
    if (req.user.id === parseInt(req.params.id) && !is_active) {
      return res.status(400).json({ error: 'Cannot deactivate your own account' });
    }

    await db.query(
      'UPDATE users SET is_active = ? WHERE id = ?',
      [is_active, req.params.id]
    );

    res.json({ message: `User ${is_active ? 'activated' : 'deactivated'} successfully` });
  } catch (err) {
    console.error('Error updating user status:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 