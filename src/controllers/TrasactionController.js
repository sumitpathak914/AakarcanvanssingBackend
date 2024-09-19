const TransactionRecord = require('../model/TrasactionsRecords'); 
const Order = require('../model/OrderManagmentandDispatchModel');
// Function to get all transaction records
const getAllTransactions = async (req, res) => {
    try {
        // Find all transaction records
        const transactionRecords = await TransactionRecord.find({});

        if (transactionRecords.length === 0) {
            return res.status(404).json({ result: false, statusCode: 404, message: 'No transaction records found.' });
        }

        // Respond with the found records
        res.status(200).json({ result: true, statusCode: 200, data: transactionRecords });
    } catch (err) {
        // Handle errors
        res.status(400).json({ result: false, statusCode: 400, error: err.message });
    }
};

// Function to get transaction records by OrderId
const getTransactionByOrderId = async (req, res) => {
    try {
        const { orderId } = req.params;

        // Find transaction records by OrderId
        const transactionRecords = await TransactionRecord.find({ orderId: orderId });

        if (transactionRecords.length === 0) {
            return res.status(404).json({ result: false, statusCode: 404, message: 'No transaction records found for this order ID.' });
        }

        // Respond with the found records
        res.status(200).json({ result: true, statusCode: 200, data: transactionRecords });
    } catch (err) {
        // Handle errors
        res.status(400).json({ result: false, statusCode: 400, error: err.message });
    }
};
const addTransaction = async (req, res) => {
    try {
        const { orderId, PaymentDoneAmount, PaymentMethod, Duepayment, Total, transactionDate, BankDetails, chequeDetails, cashDetails } = req.body;

        // Validate required fields based on payment method
        if (!orderId || !PaymentDoneAmount || !PaymentMethod || !Duepayment || !Total || !transactionDate) {
            return res.status(400).json({ result: false, statusCode: 400, message: 'Missing required fields.' });
        }

        // Retrieve the current Duepayment from the Order model
        const order = await Order.findOne({ orderId });

        if (!order) {
            return res.status(404).json({ result: false, statusCode: 404, message: 'Order not found.' });
        }

        // Ensure that Duepayment is a number before updating
        const currentDuepayment = Number(order.Duepayment); // Convert Duepayment to a number if it's stored as a string
        const paymentDoneAmount = Number(PaymentDoneAmount); // Convert PaymentDoneAmount to a number

        if (isNaN(currentDuepayment) || isNaN(paymentDoneAmount)) {
            return res.status(400).json({ result: false, statusCode: 400, message: 'Invalid numeric values.' });
        }

        // Create transaction record for adding to the array
        const newTransactionRecord = {
            PaymentDoneAmount: paymentDoneAmount,
            PaymentMethod,
            Duepayment,
            Total,
            TransactionDate: transactionDate
        };

        // Add additional details based on payment method
        if (PaymentMethod === 'bank') {
            if (!BankDetails || !BankDetails.BankName || !BankDetails.AccountHolderName || !BankDetails.AccountNumber || !BankDetails.IFSCCode) {
                return res.status(400).json({ result: false, statusCode: 400, message: 'Missing bank details.' });
            }
            newTransactionRecord.BankDetails = BankDetails;
        } else if (PaymentMethod === 'cheque') {
            if (!chequeDetails || !chequeDetails.BankName || !chequeDetails.AccountHolderName || !chequeDetails.ChequeNumber || !chequeDetails.PaymentAmount) {
                return res.status(400).json({ result: false, statusCode: 400, message: 'Missing cheque details.' });
            }
            newTransactionRecord.ChequeDetails = chequeDetails;
        } else if (PaymentMethod === 'cash') {
           
            newTransactionRecord.CashDetails = cashDetails;
        } else {
            return res.status(400).json({ result: false, statusCode: 400, message: 'Invalid payment method.' });
        }

        // Add transaction to TransactionRecord (if applicable)
        const updatedTransaction = await TransactionRecord.findOneAndUpdate(
            { orderId }, // Filter by orderId
            {
                $push: { TransactionData: newTransactionRecord }, // Add new record to TransactionData array
                $inc: { Duepayment: -paymentDoneAmount } // Decrease Duepayment in TransactionRecord
            },
            { new: true } // Return the updated document
        );

        // Update Duepayment in Order collection
        const updatedOrder = await Order.findOneAndUpdate(
            { orderId },
            {
                $set: { Duepayment: currentDuepayment - paymentDoneAmount } // Manually set Duepayment
            },
            { new: true }
        );

        if (!updatedTransaction || !updatedOrder) {
            return res.status(404).json({ result: false, statusCode: 404, message: 'Transaction or order not found.' });
        }

        res.status(200).json({ result: true, statusCode: 200, data: updatedOrder });
    } catch (err) {
        // Handle errors
        res.status(400).json({ result: false, statusCode: 400, error: err.message });
    }
};



module.exports = {
    getAllTransactions,
    getTransactionByOrderId,
    addTransaction
};
