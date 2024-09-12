// const express = require('express');
// const transactionRouter = express.Router();
// const { getTransactionByOrderId } = require('../controllers/TrasactionController'); // Adjust the path as necessary

// transactionRouter.get('/transaction/:orderId', getTransactionByOrderId);

// module.exports = transactionRouter;
const express = require('express');
const transactionRouter = express.Router();
const transactionController = require('../controllers/TrasactionController'); // Adjust the path as necessary
const authenticateToken = require('../middleware/auth');

// Route to get all transaction records
transactionRouter.get('/transactions', authenticateToken, transactionController.getAllTransactions);

// Route to get transaction records by order ID
transactionRouter.get('/transactions/:orderId', authenticateToken, transactionController.getTransactionByOrderId);

module.exports = transactionRouter;
