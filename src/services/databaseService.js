// Remove Supabase import
// import { supabase } from '../config/supabase';

// Client operations
export const clientOperations = {
  async getAllClients() {
    const res = await fetch('http://localhost:5000/api/clients');
    if (!res.ok) throw new Error('Failed to fetch clients');
    return await res.json();
  },

  async createClient(clientData) {
    const res = await fetch('http://localhost:5000/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clientData),
    });
    if (!res.ok) throw new Error('Failed to create client');
    return await res.json();
  },

  async updateClient(id, clientData) {
    const res = await fetch(`http://localhost:5000/api/clients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clientData),
    });
    if (!res.ok) throw new Error('Failed to update client');
    return await res.json();
  },

  async deleteClient(id) {
    const res = await fetch(`http://localhost:5000/api/clients/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete client');
    return true;
  },

  async getClientById(id) {
    const res = await fetch(`http://localhost:5000/api/clients/${id}`);
    if (!res.ok) throw new Error('Failed to fetch client');
    return await res.json();
  },
};

// Case operations
export const caseOperations = {
  async getAllCases() {
    const res = await fetch('http://localhost:5000/api/cases');
    if (!res.ok) throw new Error('Failed to fetch cases');
    return await res.json();
  },

  async getCaseById(id) {
    const res = await fetch(`http://localhost:5000/api/cases/${id}`);
    if (!res.ok) throw new Error('Failed to fetch case');
    return await res.json();
  },

  async getCasesByClient(clientId) {
    try {
      const res = await fetch(`http://localhost:5000/api/cases?clientId=${clientId}`);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to fetch cases');
      }
      return await res.json();
    } catch (error) {
      console.error('Error fetching cases:', error);
      throw error;
    }
  },

  async createCase(caseData) {
    const res = await fetch('http://localhost:5000/api/cases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(caseData),
    });
    if (!res.ok) throw new Error('Failed to create case');
    return await res.json();
  },

  async updateCase(id, caseData) {
    const res = await fetch(`http://localhost:5000/api/cases/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(caseData),
    });
    if (!res.ok) throw new Error('Failed to update case');
    return await res.json();
  },

  async deleteCase(id) {
    const res = await fetch(`http://localhost:5000/api/cases/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete case');
    return true;
  },

  // Get case by name
  getCaseByName: async (caseName) => {
    try {
      console.log('Searching for case:', caseName);
      const response = await fetch(`http://localhost:5000/api/cases/search?name=${encodeURIComponent(caseName)}`);
    
      if (!response.ok) {
        const error = await response.json();
        console.error('Error response:', error);
        throw new Error(error.error || error.details || 'Failed to fetch case');
      }

      const data = await response.json();
      console.log('Found case:', data);
      return data;
    } catch (error) {
      console.error('Error in getCaseByName:', error);
      throw error;
    }
  }
};

// Note operations
export const noteOperations = {
  async createNote(caseId, content) {
    const res = await fetch('http://localhost:5000/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ case_id: caseId, content }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to create note');
    }
    return await res.json();
  },

  async getNotesByCase(caseId) {
    const res = await fetch(`http://localhost:5000/api/notes?caseId=${caseId}`);
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to fetch notes');
    }
    return await res.json();
  },

  async updateNote(noteId, content) {
    const res = await fetch(`http://localhost:5000/api/notes/${noteId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to update note');
    }
    return await res.json();
  },

  async deleteNote(noteId) {
    const res = await fetch(`http://localhost:5000/api/notes/${noteId}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to delete note');
    }
    return true;
  }
};

// Practice Area operations
export const practiceAreaOperations = {
  async getAllPracticeAreas() {
    const res = await fetch('http://localhost:5000/api/practice-areas');
    if (!res.ok) throw new Error('Failed to fetch practice areas');
    return await res.json();
  },

  async createPracticeArea(name) {
    const res = await fetch('http://localhost:5000/api/practice-areas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error('Failed to create practice area');
    return await res.json();
  },

  async updatePracticeArea(id, name) {
    const res = await fetch(`http://localhost:5000/api/practice-areas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error('Failed to update practice area');
    return await res.json();
  },

  async deletePracticeArea(id) {
    const res = await fetch(`http://localhost:5000/api/practice-areas/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete practice area');
    return true;
  }
};

// Document operations
export const documentOperations = {
  createDocument: async (documentData) => {
    try {
      const response = await fetch('http://localhost:5000/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        },
        body: JSON.stringify(documentData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create document');
      }

      return data.document;
    } catch (error) {
      console.error('Error creating document:', error);
      throw error;
    }
  },

  getDocumentsByClient: async (clientId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/documents?clientId=${clientId}`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch documents');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching documents:', error);
      throw error;
    }
  },

  getDocumentById: async (documentId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/documents/${documentId}`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch document');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching document:', error);
      throw error;
    }
  },

  // Get all documents for a case
  getDocumentsByCase: async (caseId) => {
    try {
      console.log('Fetching documents for case:', caseId);
      const response = await fetch(`http://localhost:5000/api/documents/case/${caseId}`);
      
      if (!response.ok) {
        const error = await response.json();
        console.error('Error response:', error);
        throw new Error(error.error || error.details || 'Failed to fetch documents');
      }

      const data = await response.json();
      console.log('Fetched documents:', data);
      return data;
    } catch (error) {
      console.error('Error in getDocumentsByCase:', error);
      throw error;
    }
  },

  // Upload a new document
  uploadDocument: async (caseId, file, title, description) => {
    try {
      console.log('Uploading document:', {
        caseId,
        file,
        title,
        description
      });

      const formData = new FormData();
      formData.append('file', file);
      formData.append('caseId', caseId);
      if (title) formData.append('title', title);
      if (description) formData.append('description', description);

      const response = await fetch('http://localhost:5000/api/documents/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Upload error response:', error);
        throw new Error(error.error || error.details || 'Failed to upload document');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in uploadDocument:', error);
      throw error;
    }
  },

  // Delete a document
  deleteDocument: async (documentId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/documents/${documentId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete document');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  },

  // Download a document
  downloadDocument: async (documentId) => {
    try {
      console.log('Downloading document:', documentId);
      const response = await fetch(`http://localhost:5000/api/documents/${documentId}/download`);
      
      if (!response.ok) {
        const error = await response.json();
        console.error('Download error response:', error);
        throw new Error(error.error || error.details || 'Failed to download document');
      }

      // Get the blob from the response
      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.error('Error in downloadDocument:', error);
      throw error;
    }
  }
};

// Timeline operations
export const timelineOperations = {
  async createTimelineEvent(caseId, eventType, description) {
    const res = await fetch('http://localhost:5000/api/timeline-events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caseId, eventType, description }),
    });
    if (!res.ok) throw new Error('Failed to create timeline event');
    return await res.json();
  },

  async getTimelineEvents(caseId) {
    const res = await fetch(`http://localhost:5000/api/timeline-events?caseId=${caseId}`);
    if (!res.ok) throw new Error('Failed to fetch timeline events');
    return await res.json();
  },

  async updateTimelineEvent(id, eventType, description) {
    const res = await fetch(`http://localhost:5000/api/timeline-events/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventType, description }),
    });
    if (!res.ok) throw new Error('Failed to update timeline event');
    return await res.json();
  },

  async deleteTimelineEvent(id) {
    const res = await fetch(`http://localhost:5000/api/timeline-events/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete timeline event');
    return true;
  }
};

// Contact operations
export const contactOperations = {
  async getAllContacts() {
    try {
      const res = await fetch('http://localhost:5000/api/contacts');
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to fetch contacts');
      }
      return await res.json();
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }
  },

  async getContactsByCase(caseId) {
    try {
      const res = await fetch(`http://localhost:5000/api/contacts?caseId=${caseId}`);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to fetch contacts');
      }
      return await res.json();
    } catch (error) {
      console.error('Error fetching contacts:', error);
        throw error;
      }
  },

  async createContact(contactData) {
    try {
      const res = await fetch('http://localhost:5000/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to create contact');
      }
      return await res.json();
    } catch (error) {
      console.error('Error creating contact:', error);
      throw error;
    }
  },

  async updateContact(id, contactData) {
    try {
      const res = await fetch(`http://localhost:5000/api/contacts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to update contact');
      }
      return await res.json();
    } catch (error) {
      console.error('Error updating contact:', error);
      throw error;
    }
  },

  async deleteContact(id) {
    try {
      const res = await fetch(`http://localhost:5000/api/contacts/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to delete contact');
      }
      return true;
    } catch (error) {
      console.error('Error deleting contact:', error);
      throw error;
    }
  }
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

// Template operations
export const templateOperations = {
  async getAllTemplates() {
    try {
      const res = await fetch('http://localhost:5000/api/templates', {
        headers: getAuthHeaders()
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to fetch templates');
      }
      return await res.json();
    } catch (error) {
      console.error('Error fetching templates:', error);
      throw error;
    }
  },

  async getTemplatesByCategory(category) {
    try {
      const res = await fetch(`http://localhost:5000/api/templates?category=${encodeURIComponent(category)}`, {
        headers: getAuthHeaders()
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to fetch templates by category');
      }
      return await res.json();
    } catch (error) {
      console.error('Error fetching templates by category:', error);
      throw error;
    }
  },

  async getTemplateById(id) {
    try {
      const res = await fetch(`http://localhost:5000/api/templates/${id}`, {
        headers: getAuthHeaders()
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to fetch template');
      }
      return await res.json();
    } catch (error) {
      console.error('Error fetching template:', error);
      throw error;
    }
  },

  async createTemplate(templateData) {
    try {
      const response = await fetch('http://localhost:5000/api/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(templateData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create template');
      }

      const data = await response.json();
      return data.template; // Return the template from the response
    } catch (error) {
      console.error('Error creating template:', error);
      throw error;
    }
  },

  async updateTemplate(id, templateData) {
    try {
      const res = await fetch(`http://localhost:5000/api/templates/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(templateData),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to update template');
      }
      return await res.json();
    } catch (error) {
      console.error('Error updating template:', error);
      throw error;
    }
  },

  async deleteTemplate(id) {
    try {
      const res = await fetch(`http://localhost:5000/api/templates/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to delete template');
      }
      return true;
    } catch (error) {
      console.error('Error deleting template:', error);
      throw error;
    }
  },

  async generateDocument(templateId, variables) {
    try {
      const res = await fetch(`http://localhost:5000/api/templates/${templateId}/generate`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ variables }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || data.error || 'Failed to generate document');
      }
      
      if (!data.content) {
        throw new Error('No content generated from template');
      }
      
      return data;
    } catch (error) {
      console.error('Error generating document:', error);
      throw new Error(error.message || 'Failed to generate document');
    }
  }
};

export const calendarOperations = {
  getCalendarItems: async () => {
    try {
      const response = await fetch('http://localhost:5000/api/calendar', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch calendar items');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching calendar items:', error);
      throw error;
    }
  },

  getCalendarItemsByRange: async (start, end) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/calendar/range?start=${start.toISOString()}&end=${end.toISOString()}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      if (!response.ok) {
        throw new Error('Failed to fetch calendar items');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching calendar items:', error);
      throw error;
    }
  },

  createCalendarItem: async (itemData) => {
    try {
      const response = await fetch('http://localhost:5000/api/calendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(itemData)
      });
      if (!response.ok) {
        throw new Error('Failed to create calendar item');
      }
      return await response.json();
    } catch (error) {
      console.error('Error creating calendar item:', error);
      throw error;
    }
  },

  updateCalendarItem: async (id, itemData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/calendar/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(itemData)
      });
      if (!response.ok) {
        throw new Error('Failed to update calendar item');
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating calendar item:', error);
      throw error;
    }
  },

  deleteCalendarItem: async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/calendar/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to delete calendar item');
      }
      return await response.json();
    } catch (error) {
      console.error('Error deleting calendar item:', error);
      throw error;
    }
  }
}; 