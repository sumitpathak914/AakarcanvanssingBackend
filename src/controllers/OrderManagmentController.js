const Order = require('../model/OrderManagmentandDispatchModel');

const orderController = {
    CreateOrder: async (req, res) => {
        try {
            const order = new Order(req.body);
            await order.save();
            res.status(201).json({ result: true, statusCode: 201, message: 'Order successfully.' });
        } catch (err) {
            res.status(400).json({ result: false, statusCode: 400, error: err.message });
        }
    },

    GetAllOrdersDetails: async (req, res) => {
        try {
            const orders = await Order.find();
            res.status(200).json({ result: true, statusCode: 200, message: 'All Order Fetch Successfully.', OrderList: orders });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },


     GetOrderDetails : async (req, res) => {
        try {
            const { orderId, productId } = req.body;
            console.log(req.body);

            // Find the order based on orderId
            const order = await Order.findOne({ orderId });
            if (!order) {
                return res.status(404).json({ result: false, statusCode: 404, message: 'Order not found.' });
            }

            // Find the product details within the order based on productId
            const product = order.ProductDetails.find(p => p.ProductID === productId);
            if (!product) {
                return res.status(404).json({ result: false, statusCode: 404, message: 'Product not found in the order.' });
            }

            // Extract customerInfo
            const customerInfo = order.customerInfo;

            res.status(200).json({
                result: true,
                statusCode: 200,
                message: 'Order details fetched successfully.',
                ProductDetails: product,
                customerInfo: customerInfo,
            });
        } catch (err) {
            console.error('Error in GetOrderDetails:', err);
            res.status(500).json({ error: err.message });
        }
    },

};

module.exports = orderController;
