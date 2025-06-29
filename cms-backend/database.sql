-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS cms;

-- Use the database
USE cms;

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(100) NOT NULL,
    middlename VARCHAR(100),
    lastname VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    peoplegroup VARCHAR(50) DEFAULT 'client',
    enableclientportal BOOLEAN DEFAULT FALSE,
    cellphone VARCHAR(20),
    workphone VARCHAR(20),
    homephone VARCHAR(20),
    nrc VARCHAR(50) UNIQUE,
    passport VARCHAR(50),
    gender VARCHAR(10),
    dateofbirth DATE,
    placeofbirth VARCHAR(100),
    nationality VARCHAR(50),
    maritalstatus VARCHAR(20),
    occupation VARCHAR(100),
    address1 VARCHAR(255),
    address2 VARCHAR(255),
    city VARCHAR(100),
    province VARCHAR(100),
    country VARCHAR(2) DEFAULT 'ZM',
    company VARCHAR(255),
    jobtitle VARCHAR(100),
    website VARCHAR(255),
    faxnumber VARCHAR(20),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create practice_areas table
CREATE TABLE IF NOT EXISTS practice_areas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create cases table
CREATE TABLE IF NOT EXISTS cases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    casename VARCHAR(255) NOT NULL,
    casenumber VARCHAR(100) UNIQUE,
    clientid INT NOT NULL,
    practicearea_id INT,
    casestage VARCHAR(50) DEFAULT 'intake',
    dateopened DATE NOT NULL,
    dateclosed DATE,
    description TEXT,
    status VARCHAR(50) DEFAULT 'active',
    priority VARCHAR(20) DEFAULT 'normal',
    assignedto VARCHAR(100),
    office VARCHAR(100),
    statuteoflimitations DATE,
    conflictcheck BOOLEAN DEFAULT FALSE,
    conflictchecknotes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (clientid) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (practicearea_id) REFERENCES practice_areas(id) ON DELETE SET NULL
);

-- Create timeline_events table
CREATE TABLE IF NOT EXISTS timeline_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    caseid INT NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (caseid) REFERENCES cases(id) ON DELETE CASCADE
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    role ENUM('admin', 'attorney', 'paralegal', 'staff') NOT NULL DEFAULT 'staff',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create password_reset_tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create user_sessions table for tracking active sessions
CREATE TABLE IF NOT EXISTS user_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create case_contacts table
CREATE TABLE IF NOT EXISTS case_contacts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  case_id INT NOT NULL,
  firstname VARCHAR(100) NOT NULL,
  middlename VARCHAR(100),
  lastname VARCHAR(100) NOT NULL,
  role VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  company VARCHAR(255),
  jobtitle VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
);

-- Create case_notes table
CREATE TABLE IF NOT EXISTS case_notes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  case_id INT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
);

-- Create case_documents table
CREATE TABLE IF NOT EXISTS case_documents (
  id INT PRIMARY KEY AUTO_INCREMENT,
  case_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  filename VARCHAR(255) NOT NULL,
  filepath VARCHAR(255) NOT NULL,
  filesize INT NOT NULL,
  filetype VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
);

-- Create calendar_items table
CREATE TABLE IF NOT EXISTS calendar_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start DATETIME NOT NULL,
  end DATETIME NOT NULL,
  type VARCHAR(50) DEFAULT 'meeting',
  priority VARCHAR(20) DEFAULT 'medium',
  location VARCHAR(255),
  completed BOOLEAN DEFAULT FALSE,
  lawyer_id INT,
  case_id INT,
  user_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (lawyer_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE SET NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Insert some default practice areas
INSERT INTO practice_areas (name, description) VALUES
('Criminal Law', 'Handling criminal cases and defense'),
('Civil Law', 'Civil disputes and litigation'),
('Family Law', 'Divorce, custody, and family matters'),
('Corporate Law', 'Business and corporate legal matters'),
('Real Estate Law', 'Property and real estate transactions'),
('Intellectual Property', 'Patents, trademarks, and copyrights'),
('Employment Law', 'Workplace and employment issues'),
('Immigration Law', 'Immigration and naturalization matters'),
('Tax Law', 'Tax planning and disputes'),
('Estate Planning', 'Wills, trusts, and estate administration')
ON DUPLICATE KEY UPDATE description = VALUES(description);

-- Insert sample calendar items (assuming user ID 1 exists)
INSERT INTO calendar_items (title, description, start, end, type, priority, location, lawyer_id, case_id, user_id) VALUES
('Client Meeting - Smith Case', 'Initial consultation with Mr. Smith regarding contract dispute', DATE_ADD(NOW(), INTERVAL 2 HOUR), DATE_ADD(NOW(), INTERVAL 3 HOUR), 'meeting', 'high', 'Conference Room A', 1, 1, 1),
('Court Hearing - Johnson vs. ABC Corp', 'Preliminary hearing for employment discrimination case', DATE_ADD(NOW(), INTERVAL 1 DAY), DATE_ADD(NOW(), INTERVAL 1 DAY + 2 HOUR), 'court', 'high', 'District Court Room 3', 1, 2, 1),
('Document Review - Estate Planning', 'Review trust documents for Brown family estate', DATE_ADD(NOW(), INTERVAL 4 HOUR), DATE_ADD(NOW(), INTERVAL 5 HOUR), 'task', 'medium', 'Office', 1, 3, 1),
('Phone Call - Insurance Adjuster', 'Follow up call regarding settlement offer', DATE_ADD(NOW(), INTERVAL 6 HOUR), DATE_ADD(NOW(), INTERVAL 6 HOUR + 30 MINUTE), 'task', 'low', 'Phone', 1, 1, 1),
('Team Meeting', 'Weekly case review and strategy meeting', DATE_ADD(NOW(), INTERVAL 2 DAY), DATE_ADD(NOW(), INTERVAL 2 DAY + 1 HOUR), 'meeting', 'medium', 'Main Conference Room', 1, NULL, 1),
('Deposition - Witness Interview', 'Deposition of key witness in fraud case', DATE_ADD(NOW(), INTERVAL 3 DAY), DATE_ADD(NOW(), INTERVAL 3 DAY + 3 HOUR), 'court', 'high', 'Law Office Conference Room', 1, 2, 1),
('Contract Drafting - Real Estate Deal', 'Draft purchase agreement for commercial property', DATE_ADD(NOW(), INTERVAL 1 DAY + 4 HOUR), DATE_ADD(NOW(), INTERVAL 1 DAY + 6 HOUR), 'task', 'medium', 'Office', 1, 4, 1),
('Client Consultation - Immigration Case', 'Initial meeting with new immigration client', DATE_ADD(NOW(), INTERVAL 5 DAY), DATE_ADD(NOW(), INTERVAL 5 DAY + 1 HOUR), 'meeting', 'medium', 'Conference Room B', 1, 5, 1)
ON DUPLICATE KEY UPDATE 
  title = VALUES(title),
  description = VALUES(description),
  start = VALUES(start),
  end = VALUES(end),
  type = VALUES(type),
  priority = VALUES(priority),
  location = VALUES(location);

-- Insert sample clients
INSERT INTO clients (firstname, lastname, email, cellphone, address1, city, country) VALUES
('John', 'Smith', 'john.smith@email.com', '+260955123456', '123 Main Street', 'Lusaka', 'ZM'),
('Sarah', 'Johnson', 'sarah.johnson@email.com', '+260955234567', '456 Oak Avenue', 'Kitwe', 'ZM'),
('Michael', 'Brown', 'michael.brown@email.com', '+260955345678', '789 Pine Road', 'Ndola', 'ZM'),
('Emily', 'Davis', 'emily.davis@email.com', '+260955456789', '321 Elm Street', 'Lusaka', 'ZM'),
('David', 'Wilson', 'david.wilson@email.com', '+260955567890', '654 Maple Drive', 'Kitwe', 'ZM')
ON DUPLICATE KEY UPDATE 
  firstname = VALUES(firstname),
  lastname = VALUES(lastname),
  email = VALUES(email);

-- Insert sample cases
INSERT INTO cases (casename, casenumber, clientid, practicearea_id, casestage, dateopened, description, status, priority) VALUES
('Smith Contract Dispute', 'CASE-2024-001', 1, 2, 'intake', CURDATE(), 'Contract dispute between Smith and ABC Company', 'active', 'high'),
('Johnson Employment Discrimination', 'CASE-2024-002', 2, 7, 'discovery', CURDATE(), 'Employment discrimination case against ABC Corp', 'active', 'high'),
('Brown Estate Planning', 'CASE-2024-003', 3, 10, 'drafting', CURDATE(), 'Estate planning and trust creation for Brown family', 'active', 'medium'),
('Davis Real Estate Transaction', 'CASE-2024-004', 4, 5, 'negotiation', CURDATE(), 'Commercial real estate purchase agreement', 'active', 'medium'),
('Wilson Immigration Case', 'CASE-2024-005', 5, 8, 'intake', CURDATE(), 'Immigration application and naturalization process', 'active', 'low')
ON DUPLICATE KEY UPDATE 
  casename = VALUES(casename),
  casenumber = VALUES(casenumber),
  description = VALUES(description); 