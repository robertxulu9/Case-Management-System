// app.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const clientsRouter = require('./routes/clients');
const casesRouter = require('./routes/cases');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const practiceAreasRouter = require('./routes/practice-areas');
const timelineEventsRouter = require('./routes/timeline-events');
const contactsRouter = require('./routes/contacts');
const notesRouter = require('./routes/notes');
const documentsRouter = require('./routes/documents');
const templatesRouter = require('./routes/templates');
const calendarRoutes = require('./routes/calendar');
const lawyersRouter = require('./routes/lawyers');
// Add other routers as you build them

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/clients', clientsRouter);
app.use('/api/cases', casesRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/practice-areas', practiceAreasRouter);
app.use('/api/timeline-events', timelineEventsRouter);
app.use('/api/contacts', contactsRouter);
app.use('/api/notes', notesRouter);
app.use('/api/documents', documentsRouter);
app.use('/api/templates', templatesRouter);
app.use('/api/calendar', calendarRoutes);
app.use('/api/lawyers', lawyersRouter);
// Add other routes here

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});