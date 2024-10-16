const express = require('express');
const { createOrUpdateCounts, getCounts } = require('../controllers/CountController');

const CountRouter = express.Router();

// Route to create or update counts
CountRouter.post('/Addcounts', createOrUpdateCounts);

// Route to get counts
CountRouter.get('/counts', getCounts);

module.exports = CountRouter;
