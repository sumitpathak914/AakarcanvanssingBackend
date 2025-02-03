const express = require('express');
const cartFieldDealerrouter = express.Router();
const catelfieldController = require('../controllers/Dealer_Catelfield'); // Adjust the path as per your project structure


cartFieldDealerrouter.post('/AddDealer', catelfieldController.SaveDealer);
// cartFieldDealerrouter.get('/GetFactory', authenticateToken, FactoryController.getAllFactories);
cartFieldDealerrouter.post('/dealerlogin', catelfieldController.LoginDealer);
cartFieldDealerrouter.get('/Getdealers', catelfieldController.GetAllDealers);
cartFieldDealerrouter.post('/LoginAccess', catelfieldController.UpdateIsAllowLogin);
cartFieldDealerrouter.get('/DealerCommission', catelfieldController.calculateDealerCommission);
cartFieldDealerrouter.get('/DealerDetails/:shopId', catelfieldController.GetDealerByShopId);
cartFieldDealerrouter.delete('/dealerDelete/:shopId', catelfieldController.DeleteDealer);
// cartFieldDealerrouter.put('/dealersUpdate/:shopId', catelfieldController.UpdateDealer);
cartFieldDealerrouter.put('/update/:shopId', catelfieldController.UpdateDealer);
cartFieldDealerrouter.post('/generate-Dealer-invoice', catelfieldController.generateDealerInvoice);
cartFieldDealerrouter.post('/UpdateCommissionAmountDealer', catelfieldController.UpdateDealerCommission);
cartFieldDealerrouter.post('/forgot-password', catelfieldController.forgotPassword);
cartFieldDealerrouter.post('/verify-otp', catelfieldController.verifyOtp);
cartFieldDealerrouter.post('/reset-password', catelfieldController.resetPassword);
module.exports = cartFieldDealerrouter;
