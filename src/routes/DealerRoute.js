const express = require('express');
const Dealerrouter = express.Router();
const DealerContoller = require('../controllers/DealerContorller'); // Adjust the path as per your project structure
const authenticateToken = require('../middleware/auth');

Dealerrouter.post('/AddDealer', DealerContoller.SaveDealer);
// Dealerrouter.get('/GetFactory', authenticateToken, FactoryController.getAllFactories);
Dealerrouter.post('/dealerlogin', DealerContoller.LoginDealer);
Dealerrouter.get('/Getdealers', DealerContoller.GetAllDealers);
Dealerrouter.post('/LoginAccess', DealerContoller.UpdateIsAllowLogin);
module.exports = Dealerrouter;
