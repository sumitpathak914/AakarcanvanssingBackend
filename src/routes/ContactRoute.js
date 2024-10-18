// routes/contactRoutes.js
const express = require('express');
const Contactrouter = express.Router();
const { submitContactForm, getContacts, deleteContact, resetCount } = require('../controllers/ContactController');

// @route  POST /api/contact
// @desc   Handle contact form submission
// @access Public
Contactrouter.post('/SubmitContactDetails', submitContactForm);
Contactrouter.get('/GetContactsDetails', getContacts);
Contactrouter.delete('/DeleteRecords/:contactId', deleteContact);
Contactrouter.put('/ViewRecords/reset-count', resetCount);
module.exports = Contactrouter;
