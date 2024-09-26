const PurchaseReturn = require('../model/PurchaseReturnModel');

// Add a new return order
const addReturnOrder = async (req, res) => {
    try {
        const {
            OrderId,
            productDetails,
            SupplierInfo,
            customerInfo,
            returnStatus
        } = req.body;

        const newPurchaseReturn = new PurchaseReturn({
            OrderId,
            productDetails,
            SupplierInfo,
            customerInfo,
            returnStatus
        });

        await newPurchaseReturn.save();
        return res.status(201).json({
            success: true,
            message: 'Return order added successfully!',
            data: newPurchaseReturn
        });
    } catch (error) {
        console.error('Error adding return order:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to add return order',
            error: error.message
        });
    }
};
const getAllReturnOrders = async (req, res) => {
    try {
        const returnOrders = await PurchaseReturn.find();
        return res.status(200).json({
            statusCode: 200,
            result: true,
            message: 'All return orders fetched successfully!',
            data: returnOrders
        });
    } catch (error) {
        console.error('Error fetching return orders:', error);
        return res.status(500).json({
            result: false,
            statusCode:500,
            message: 'Failed to fetch return orders',
            error: error.message
        });
    }
};
module.exports = { addReturnOrder, getAllReturnOrders };
