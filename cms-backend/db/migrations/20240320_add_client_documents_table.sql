-- Create client_documents table
CREATE TABLE IF NOT EXISTS client_documents (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  client_id INT NOT NULL,
  template_id INT NOT NULL,
  status ENUM('draft', 'sent', 'viewed', 'archived') DEFAULT 'draft',
  sent_date DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by INT,
  updated_by INT,
  is_active BOOLEAN DEFAULT true,
  FOREIGN KEY (client_id) REFERENCES clients(id),
  FOREIGN KEY (template_id) REFERENCES document_templates(id),
  FOREIGN KEY (created_by) REFERENCES users(id),
  FOREIGN KEY (updated_by) REFERENCES users(id)
); 