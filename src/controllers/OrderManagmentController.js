const Order = require('../model/OrderManagmentandDispatchModel');
const TransactionRecord = require('../model/TrasactionsRecords');
const orderController = {
    //  CreateOrder : async (req, res) => {
    //     try {
    //         // Destructure the relevant fields from the request body
    //         const { orderId, Total, PaymentDoneAmount, PaymentMethod, Duepayment, ProductDetails, customerInfo, PaymentDetails } = req.body;

    //         // Determine which payment details to include based on PaymentMethod
    //         let paymentDetails;

    //         if (PaymentMethod === 'bank') {
    //             paymentDetails = {
    //                 BankDetails: {
    //                     BankName: PaymentDetails.BankName,
    //                     AccountHolderName: PaymentDetails.AccountHolderName,
    //                     AccountNumber: PaymentDetails.AccountNumber,
    //                     IFSCCode: PaymentDetails.IFSCCode,
    //                     PaymentAmount: PaymentDetails.PaymentAmount
    //                 }
    //             };
    //         } else if (PaymentMethod === 'cheque') {
    //             paymentDetails = {
    //                 ChequeDetails: {
    //                     BankName: PaymentDetails.BankName,
    //                     AccountHolderName: PaymentDetails.AccountHolderName,
    //                     ChequeNumber: PaymentDetails.ChequeNumber,
    //                     PaymentAmount: PaymentDetails.PaymentAmount
    //                 }
    //             };
    //         } else {
    //             // If PaymentMethod is not recognized, respond with an error
    //             return res.status(400).json({ result: false, statusCode: 400, error: 'Invalid payment method.' });
    //         }

    //         // Create a new Order instance with the payment details
    //         const order = new Order({
    //             ...req.body,
    //             PaymentDetails: paymentDetails // Add the determined payment details
    //         });

    //         // Save the order to the database
    //         await order.save();

    //         // Create an array of TransactionRecordsData based on the provided data
    //         const transactionData = [];

    //         // Add a transaction record if PaymentDoneAmount and Total are provided
    //         if (PaymentDoneAmount && Total) {
    //             transactionData.push({
    //                 PaymentDoneAmount,
    //                 PaymentMethod,
    //                 Duepayment,
    //                 Total
    //             });
    //         }

    //         // Create a new TransactionRecord instance with the extracted data
    //         const transactionRecord = new TransactionRecord({
    //             orderId,
    //             Date: new Date(), // Use the current date or provide a specific date
    //             Total,
    //             customerInfo,
    //             ProductDetails,
    //             TransactionData: transactionData // Add the constructed array here
    //         });

    //         // Save the transaction record to the database
    //         await transactionRecord.save();

    //         // Respond with a success message
    //         res.status(201).json({ result: true, statusCode: 201, message: 'Order created successfully.' });
    //     } catch (err) {
    //         // Respond with an error message
    //         res.status(400).json({ result: false, statusCode: 400, error: err.message });
    //     }
    // },

    CreateOrder: async (req, res) => {
        try {
            // Destructure the relevant fields from the request body
            const { orderId, Total, PaymentDoneAmount, Duepayment, ProductDetails, customerInfo } = req.body;

            // Determine which payment details to include based on PaymentMethod
            const transactionData = {
                PaymentDoneAmount,  
                Duepayment,
                Total,     
            };

            // Create a new Order instance with the payment details
            const order = new Order(req.body);

            await order.save();


            // Create a new TransactionRecord instance with the extracted data
            const transactionRecord = new TransactionRecord({
                orderId,
                Date: new Date(), // Use the current date or provide a specific date
                Total,
                customerInfo,
                ProductDetails,
                TransactionData: [transactionData] // Add the constructed array here
            });

            // Save the transaction record to the database
            await transactionRecord.save();

            // Respond with a success message
            res.status(201).json({ result: true, statusCode: 201, message: 'Order created successfully.' });
        } catch (err) {
            // Respond with an error message
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

    getOrdersByShopId: async (req, res) => {
        try {
            const { ShopId } = req.params;

            // Fetch orders where ShopId matches
            const orders = await Order.find({ ShopId });

            if (orders.length > 0) {
                res.status(200).json({
                    success: true,
                    message: 'Orders found',
                    OrderList: orders
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: 'No orders found for the provided ShopId'
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Server error',
                error: error.message
            });
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
                orderId: order.orderId,
                Total: order.Total,
                PaymentDoneAmount: order.PaymentDoneAmount,
                PaymentMethod: order.PaymentMethod,
                Duepayment: order.Duepayment,
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
                            orderId: order.orderId,
                            Duepayment: order.Duepayment
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
                DispatchStatus: 'Dispatched',
                EstimatedDeliveryDate: estimatedDeliveryDate
            };

            // Update order tracking details
            product.OrderTrackingDetails = {
                ...product.OrderTrackingDetails,
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
                product.OrderTrackingDetails.Out_for_Delivery = true;
                product.OrderTrackingDetails.Out_for_Delivery_Note = note || 'Your order is out for delivery';
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

    ChangeReturnOrderStatus: async (req, res) => {
        const { orderId, productId, action, reason } = req.body;

        if (!orderId || !productId || !action) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        try {
            // Find the order by ID
            const order = await Order.findOne({ orderId });

            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            // Find the product within the order
            const product = order.ProductDetails.find(p => p.ProductID === productId);

            if (!product) {
                return res.status(404).json({ message: 'Product not found in the order' });
            }
            if (action === "ApproveRefund") {
                product.dispatchShippingDetails.RefundStatus = 'Refund List';
            } else {
                product.dispatchShippingDetails.RefundStatus = 'Rejected';
                product.dispatchShippingDetails.RejectRefundReasons = reason;
            }
            // Update the refund status


            // Save the order with updated refund status
            await order.save();

            res.status(200).json({ message: 'Refund status updated successfully' });
        } catch (error) {
            console.error('Error updating refund status:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }
};

module.exports = orderController;
