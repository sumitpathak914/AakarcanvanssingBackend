const express = require('express');
const Pricerouter = express.Router();
const { togglePriceStatus, getPriceStatus } = require('../controllers/PriceController');

Pricerouter.post('/api/togglePrice', togglePriceStatus);
Pricerouter.get('/api/GetPriceStatus', getPriceStatus);
module.exports = Pricerouter;