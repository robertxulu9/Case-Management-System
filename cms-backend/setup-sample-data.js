const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupSampleData() {
  let connection;
  
  try {
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'cms',
      port: process.env.DB_PORT || 3306
    });

    console.log('Connected to database successfully');

    // Check if we have a user to work with
    const [users] = await connection.execute('SELECT id FROM users LIMIT 1');
    
    if (users.length === 0) {
      console.log('No users found. Please create a user first through the signup process.');
      return;
    }

    const userId = users[0].id;
    console.log(`Using user ID: ${userId}`);

    // Check if we have clients
    const [clients] = await connection.execute('SELECT id FROM clients LIMIT 1');
    
    if (clients.length === 0) {
      console.log('No clients found. Please add some clients first.');
      return;
    }

    // Check if we have cases
    const [cases] = await connection.execute('SELECT id FROM cases LIMIT 1');
    
    if (cases.length === 0) {
      console.log('No cases found. Please add some cases first.');
      return;
    }

    // Insert sample calendar items
    const sampleCalendarItems = [
      {
        title: 'Client Meeting - Smith Case',
        description: 'Initial consultation with Mr. Smith regarding contract dispute',
        start: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        end: new Date(Date.now() + 3 * 60 * 60 * 1000),   // 3 hours from now
        type: 'meeting',
        priority: 'high',
        location: 'Conference Room A',
        lawyer_id: userId,
        case_id: cases[0].id,
        user_id: userId
      },
      {
        title: 'Court Hearing - Johnson vs. ABC Corp',
        description: 'Preliminary hearing for employment discrimination case',
        start: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
        end: new Date(Date.now() + 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 1 day + 2 hours from now
        type: 'court',
        priority: 'high',
        location: 'District Court Room 3',
        lawyer_id: userId,
        case_id: cases[0].id,
        user_id: userId
      },
      {
        title: 'Document Review - Estate Planning',
        description: 'Review trust documents for Brown family estate',
        start: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
        end: new Date(Date.now() + 5 * 60 * 60 * 1000),   // 5 hours from now
        type: 'task',
        priority: 'medium',
        location: 'Office',
        lawyer_id: userId,
        case_id: cases[0].id,
        user_id: userId
      },
      {
        title: 'Phone Call - Insurance Adjuster',
        description: 'Follow up call regarding settlement offer',
        start: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
        end: new Date(Date.now() + 6 * 60 * 60 * 1000 + 30 * 60 * 1000), // 6 hours + 30 minutes from now
        type: 'task',
        priority: 'low',
        location: 'Phone',
        lawyer_id: userId,
        case_id: cases[0].id,
        user_id: userId
      },
      {
        title: 'Team Meeting',
        description: 'Weekly case review and strategy meeting',
        start: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        end: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000), // 2 days + 1 hour from now
        type: 'meeting',
        priority: 'medium',
        location: 'Main Conference Room',
        lawyer_id: userId,
        case_id: null,
        user_id: userId
      }
    ];

    for (const item of sampleCalendarItems) {
      await connection.execute(
        `INSERT INTO calendar_items 
         (title, description, start, end, type, priority, location, lawyer_id, case_id, user_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [item.title, item.description, item.start, item.end, item.type, item.priority, item.location, item.lawyer_id, item.case_id, item.user_id]
      );
    }

    console.log('Sample calendar items created successfully!');
    console.log('You can now view upcoming events and tasks in the dashboard.');

  } catch (error) {
    console.error('Error setting up sample data:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run the setup
setupSampleData(); 