// routes/contactRoutes.js
const express = require('express');
const Contactrouter = express.Router();
const { submitContactForm } = require('../controllers/ContactController');

// @route  POST /api/contact
// @desc   Handle contact form submission
// @access Public
Contactrouter.post('/SubmitContactDetails', submitContactForm);

module.exports = Contactrouter;
