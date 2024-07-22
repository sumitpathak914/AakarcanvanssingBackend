const Order = require('../model/OrderManagmentandDispatchModel');

const orderController = {
   CreateOrder: async (req, res) => {
        try {
            const order = new Order(req.body);
            await order.save();
            res.status(201).json({ result: true, statusCode: 201, message: 'Order successfully.'});
        } catch (err) {
            res.status(400).json({ result: false, statusCode: 400, error: err.message });
        }
    },

    GetAllOrdersDetails: async (req, res) => {
        try {
            const orders = await Order.find();
            res.status(200).json({ result: true, statusCode: 200, message: 'All Order Fetch Successfully.' ,OrderList: orders });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    
};

module.exports = orderController;
