// routes/dealWeekRoutes.js
const express = require('express');
const dealWeekController = require('../controllers/DealoftheweekController');
const dealWeekrouter = express.Router();

dealWeekrouter.post('/AddDealOfTheWeek', dealWeekController.addDealOfTheWeekProducts);
dealWeekrouter.delete('/remove/:id', dealWeekController.removeDealOfTheWeekProduct);
dealWeekrouter.get('/GetDealsProduct', dealWeekController.getDealOfTheWeek);
module.exports = dealWeekrouter;
