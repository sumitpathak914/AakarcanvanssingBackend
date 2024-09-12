const TransactionRecord = require('../model/TrasactionsRecords'); // Adjust the path as necessary

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

module.exports = {
    getAllTransactions,
    getTransactionByOrderId
};
