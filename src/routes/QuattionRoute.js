// Import necessary modules
const express = require('express');
const router = express.Router();

const QuatationController = require('../controllers/QuatationController'); // Adjust the path as per your project structure
const authenticateToken = require('../middleware/auth');



// Define routes with multer middleware

router.post('/AddQuate', authenticateToken, QuatationController.saveQuotation);
router.get('/GetAllQuote', authenticateToken, QuatationController.getQuotations);

module.exports = router;
