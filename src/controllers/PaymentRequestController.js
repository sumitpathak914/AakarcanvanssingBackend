const Payment = require('../model/PaymentRequestModel');

// Create Payment
exports.createPayment = async (req, res) => {
    try {
        const { orderId, paymentDoneAmount, paymentMethod, duePayment, transactionDate, bankDetails, chequeDetails, cashDetails, Total } = req.body;

        let paymentData = {
            orderId,
            paymentDoneAmount,
            paymentMethod,
            duePayment,
            transactionDate,
            Total
        };

        // Conditionally add payment method details
        if (paymentMethod === 'bank') {
            paymentData.bankDetails = bankDetails;
        } else if (paymentMethod === 'cheque') {
            paymentData.chequeDetails = chequeDetails;
        } else if (paymentMethod === 'cash') {
            paymentData.cashDetails = cashDetails;
        }

        const payment = new Payment(paymentData);
        await payment.save();

        res.status(201).json({
            success: true,
            statusCode:201,
            message: 'Payment data saved successfully!',
            payment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'An error occurred while saving payment data.',
            error: error.message
        });
    }
};

// Get list of payments
exports.getPayments = async (req, res) => {
    try {
        const payments = await Payment.find().populate('orderId'); // Populate order details if necessary
        res.status(200).json({
            statusCode:200,
            success: true,
            payments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching payment data.',
            error: error.message
        });
    }
};
