const express = require('express');
const { addReturnOrder, getAllReturnOrders } = require('../controllers/PurchaseReturnController');

const PurchaseReturnrouter = express.Router();

// Route to add a return order
PurchaseReturnrouter.post('/addReturnOrder', addReturnOrder);
PurchaseReturnrouter.get('/getAllReturnOrders', getAllReturnOrders);
module.exports = PurchaseReturnrouter;
