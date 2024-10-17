// routes/contactRoutes.js
const express = require('express');
const Contactrouter = express.Router();
const { submitContactForm, getContacts } = require('../controllers/ContactController');

// @route  POST /api/contact
// @desc   Handle contact form submission
// @access Public
Contactrouter.post('/SubmitContactDetails', submitContactForm);
Contactrouter.get('/GetContactsDetails', getContacts);
module.exports = Contactrouter;
