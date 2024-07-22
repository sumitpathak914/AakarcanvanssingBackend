const express = require('express');
const RegisterRouter = express.Router();
const RegisterController = require('../controllers/RegisterContoller');

// POST login route
RegisterRouter.post('/Register', RegisterController.registerUser);

module.exports = RegisterRouter;
