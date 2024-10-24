const express = require('express');
const countRouter = express.Router();
const countController = require('../controllers/DashboardCountController');

// Route to get all the counts
countRouter.get('/countsApi', countController.getCounts);
countRouter.get('/countsApi/:factoryId', countController.getProductCountsByFactory);
module.exports = countRouter;
