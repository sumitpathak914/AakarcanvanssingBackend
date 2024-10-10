const express = require('express');
const Dealerrouter = express.Router();
const DealerContoller = require('../controllers/DealerContorller'); // Adjust the path as per your project structure


Dealerrouter.post('/AddDealer', DealerContoller.SaveDealer);
// Dealerrouter.get('/GetFactory', authenticateToken, FactoryController.getAllFactories);
Dealerrouter.post('/dealerlogin', DealerContoller.LoginDealer);
Dealerrouter.get('/Getdealers', DealerContoller.GetAllDealers);
Dealerrouter.post('/LoginAccess', DealerContoller.UpdateIsAllowLogin);
Dealerrouter.get('/DealerCommission', DealerContoller.calculateDealerCommission);
Dealerrouter.get('/DealerDetails/:shopId', DealerContoller.GetDealerByShopId);
Dealerrouter.delete('/dealerDelete/:shopId', DealerContoller.DeleteDealer);
// Dealerrouter.put('/dealersUpdate/:shopId', DealerContoller.UpdateDealer);
Dealerrouter.put('/update/:shopId', DealerContoller.UpdateDealer);
Dealerrouter.post('/generate-Dealer-invoice', DealerContoller.generateDealerInvoice);
module.exports = Dealerrouter;
