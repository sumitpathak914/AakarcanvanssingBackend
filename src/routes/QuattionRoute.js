// Import necessary modules
const express = require('express');
const router = express.Router();

const QuatationController = require('../controllers/QuatationController'); // Adjust the path as per your project structure
const authenticateToken = require('../middleware/auth');



// Define routes with multer middleware

router.post('/AddQuate', QuatationController.saveQuotation);
router.get('/GetAllQuote', QuatationController.getQuotations);
router.get('/GetQuoteDetails/:id', QuatationController.getRecordById);
router.delete('/DeleteQuote/:id', QuatationController.deleteRecordById);
module.exports = router;
