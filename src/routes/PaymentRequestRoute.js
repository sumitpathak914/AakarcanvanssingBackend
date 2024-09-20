const express = require('express');
const PaymentRequestrouter = express.Router();
const { createPayment, getPayments, deletePaymentByOrderId } = require('../controllers/PaymentRequestController');

// Route to create a payment
PaymentRequestrouter.post('/create', createPayment);

// Route to get all payments
PaymentRequestrouter.get('/list', getPayments);
PaymentRequestrouter.delete('/PaymentSuccess/:orderId', deletePaymentByOrderId);

module.exports = PaymentRequestrouter;
