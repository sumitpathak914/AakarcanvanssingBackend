// routes/testimonialRoutes.js
const express = require('express');
const { addTestimonial, getTestimonials, updateTestimonial, deleteTestimonial } = require('../controllers/TestimonalsController');
const Testimonialsrouter = express.Router();

Testimonialsrouter.post('/AddTestimonials', addTestimonial); // Add testimonial
Testimonialsrouter.get('/GetTestimonials', getTestimonials); // Get all testimonials
Testimonialsrouter.put('/UpdateTestimonials/:id', updateTestimonial); // Update testimonial by ID
Testimonialsrouter.delete('/DeleteTestimonials/:id', deleteTestimonial); // Delete testimonial by ID

module.exports = Testimonialsrouter;
