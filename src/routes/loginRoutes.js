const express = require('express');
const loginRouter = express.Router();
const loginController = require('../controllers/loginController');

// POST login route
loginRouter.post('/login', loginController.loginUser);

module.exports = loginRouter;
