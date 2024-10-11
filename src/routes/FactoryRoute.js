const express = require('express');
const router = express.Router();
const FactoryController = require('../controllers/FactoryContoller'); // Adjust the path as per your project structure
const authenticateToken = require('../middleware/auth');

router.post('/AddFactory', authenticateToken, FactoryController.SaveFactory);
router.get('/GetFactory', authenticateToken, FactoryController.getAllFactories);
router.get('/FactoryCommission', FactoryController.calculateFactoryCommission);
router.post('/generate-factory-invoice', FactoryController.generateFactoryInvoice);
router.post('/GetFactorycommission', FactoryController.calculateSingleFactoryCommission);
module.exports = router;
