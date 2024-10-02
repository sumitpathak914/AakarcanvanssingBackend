const express = require('express');
const { addReturnOrder, getAllReturnOrders, UpdateStatusofReturnProduct, GetTheStatusOfReturnProduct } = require('../controllers/PurchaseReturnController');

const PurchaseReturnrouter = express.Router();

// Route to add a return order
PurchaseReturnrouter.post('/addReturnOrder', addReturnOrder);
PurchaseReturnrouter.post('/UpdateStatusReturnProduct', UpdateStatusofReturnProduct );
PurchaseReturnrouter.get('/getAllReturnOrders', getAllReturnOrders);
PurchaseReturnrouter.post('/Get_the_ReturnStatus', GetTheStatusOfReturnProduct);
module.exports = PurchaseReturnrouter;
