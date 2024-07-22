const express = require('express');
const router = express.Router();
const FactoryController = require('../controllers/FactoryContoller'); // Adjust the path as per your project structure
const authenticateToken = require('../middleware/auth');

router.post('/AddFactory', authenticateToken, FactoryController.SaveFactory);
router.get('/GetFactory', authenticateToken, FactoryController.getAllFactories);

module.exports = router;
