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


    GetOrderDetails: async (req, res) => {
        try {
            const { orderId, productId } = req.body;


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
                orderId: order.orderId,  // Include the orderId in the response
                ProductDetails: product,
                customerInfo: customerInfo,
            });
        } catch (err) {
            console.error('Error in GetOrderDetails:', err);
            res.status(500).json({ error: err.message });
        }
    },


    UpdateTheOrderStatus: async (req, res) => {
        const { orderId, productId, uniqueCode } = req.body;

        try {
            // Log the incoming request data


            // Fetch the order from the database
            const order = await Order.findOne({ orderId });

            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            // Find the product within the order
            const product = order.ProductDetails.find(p => p.ProductID === productId);

            if (!product) {
                return res.status(404).json({ message: 'Product not found in order' });
            }

            // Log the current state of the product for debugging
            console.log('Current Product Details:', product);

            // Update product details
            product.dispatchShippingDetails.OrderStatus = 'Shipped';
            // product.OrderTrackingDetails.Shipped = true;
            product.OrderTrackingDetails.Place = true;
            product.dispatchShippingDetails.DispatchStatus = 'pending';
            product.dispatchShippingDetails.DispatchID = uniqueCode; // Ensure DispatchId is correctly assigned

            // Log the updated state of the product for debugging


            // Save the updated order
            const updatedOrder = await order.save();

            // Log the result of the save operation
            console.log('Order After Save:', updatedOrder);

            // Send response
            res.json({ message: 'Order status updated successfully' });
        } catch (error) {
            // Handle errors
            console.error('Error updating order status:', error);
            res.status(500).json({ message: 'Server error', error });
        }
    },
    handleOrderActionUpdateAndCancel: async (req, res) => {
        const { modelAction, orderId, productId, reason, sendEmail } = req.body;

        if (!modelAction || !orderId || !productId || !reason) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        try {
            const order = await Order.findOne({ orderId });

            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            const product = order.ProductDetails.find(p => p.ProductID === productId);

            if (!product) {
                return res.status(404).json({ message: 'Product not found in order' });
            }

            if (modelAction === 'Pending') {
                product.dispatchShippingDetails.OrderPendingReason = reason;
                product.dispatchShippingDetails.OrderStatus = modelAction;
                product.dispatchShippingDetails.OrderCancelReason = "";
            } else if (modelAction === 'Cancel') {
                product.dispatchShippingDetails.OrderPendingReason = "";
                product.dispatchShippingDetails.OrderCancelReason = reason;
                product.dispatchShippingDetails.OrderStatus = "Canceled";
            } else {
                return res.status(400).json({ error: 'Invalid model action' });
            }

            // Save the updated order
            await order.save();

            res.status(201).json({ message: 'Order action recorded successfully' });
        } catch (error) {
            console.error('Error recording order action:', error);
            res.status(500).json({ error: 'Failed to record order action' });
        }
    },

    getDispatchingOrders: async (req, res) => {
        try {
            // Fetch all orders
            const orders = await Order.find();

            // Collect all products that match the criteria into a single array
            const filteredProducts = [];

            orders.forEach(order => {
                order.ProductDetails.forEach(product => {
                    if (product.dispatchShippingDetails.OrderStatus === 'Shipped') {
                        filteredProducts.push({
                            ...product.toObject(),
                            customerInfo: order.customerInfo,
                            orderId: order.orderId
                        });
                    }
                });
            });

            res.json({
                result: true,
                statusCode: 200,
                message: 'Dispatch Product List retrieved successfully',
                DispatchOrderList: filteredProducts
            });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    },

    AddDetailsOfDispatch: async (req, res) => {
        try {
            const {
                orderId, // Order ID
                productId, // Product ID within the order
                estimatedDeliveryDate,
                driverName,
                contactNumber,
                vehicleNumber,
                taxesPaidBy,
                insurance,
                weight,
                numberOfItems,
                Category
            } = req.body;

            // Find the order by orderId
            const order = await Order.findOne({ orderId });

            if (!order) {
                return res.status(404).json({ result: false, statusCode: 404, message: 'Order not found' });
            }

            // Find the product within the order
            const product = order.ProductDetails.find(p => p.ProductID === productId);

            if (!product) {
                return res.status(404).json({ result: false, statusCode: 404, message: 'Product not found in the order' });
            }

            // Update dispatch details for the found product
            product.dispatchShippingDetails = {
                ...product.dispatchShippingDetails,
                DriverName: driverName,
                ContactNumber: contactNumber,
                VehicleNumber: vehicleNumber,
                TaxAndDuties: taxesPaidBy,
                Insurance: insurance,
                weight: weight,
                numberOfItems: numberOfItems,
                Category: Category,
                OrderStatus: 'Shipped',
                DispatchStatus: 'Dispatched'
            };

            // Update order tracking details
            product.OrderTrackingDetails = {
                ...product.OrderTrackingDetails,
                EstimatedDeliveryDate: estimatedDeliveryDate,
                Shipped: true,
                ShippedNote: "Your order was shipped successfully"
            };

            // Save the updated order
            await order.save();

            res.status(200).json({ result: true, statusCode: 200, message: 'Dispatch confirmed successfully' });
        } catch (error) {
            res.status(500).json({ result: false, statusCode: 500, message: 'Error updating dispatch details', error: error.message });
        }
    },


    ChangeTheStatusOfTracking: async (req, res) => {
        const { orderId, productId, status, note } = req.body;

        try {
            const order = await Order.findOne({ orderId });
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            const product = order.ProductDetails.find(p => p.ProductID === productId);
            if (!product) {
                return res.status(404).json({ message: 'Product not found in order' });
            }

            if (status === 'Out for Delivery') {
                product.OrderTrackingDetails.Out_for_Delivery = true;
                product.OrderTrackingDetails.Out_for_Delivery_Note = note || 'Your order is out for delivery';
            } else {
                product.OrderTrackingDetails.Delivered = true;
                product.OrderTrackingDetails.DeliveredNote = note || 'Your Order has been Successfully Delivered';
                product.dispatchShippingDetails.DispatchStatus = 'Completed';
            }
           


            await order.save();

            res.status(200).json({ message: 'Order status updated successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    },
};

module.exports = orderController;
