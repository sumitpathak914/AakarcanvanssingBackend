const express = require('express');
const RegisterRouter = express.Router();
const RegisterController = require('../controllers/RegisterContoller');

// POST login route
RegisterRouter.post('/Register', RegisterController.registerUser);
RegisterRouter.post('/UpdateCommissionAmount', RegisterController.updateCommissionDoneAmount);
module.exports = RegisterRouter;
