const Order = require('../model/OrderManagmentandDispatchModel');
const TransactionRecord = require('../model/TrasactionsRecords');
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    secure: false,
    auth: {
        user: 'sumitpathakofficial914@gmail.com',
        pass: 'awtiquudehddpias' // Make sure to secure this using environment variables
    }
});
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
            const { orderId, Total, PaymentMethod, PaymentDoneAmount, Duepayment, ProductDetails, customerInfo } = req.body;

            // Determine which payment details to include based on PaymentMethod
            const transactionData = {
                PaymentDoneAmount,
                Duepayment,
                Total,
                PaymentMethod,

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
                PaymentMethod,
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
    getOrdersByShopIdWithStatus: async (req, res) => {
        try {
            const { ShopId } = req.params;
            const { status } = req.query; // Capture the status from query parameters

            // Fetch orders where ShopId matches
            const orders = await Order.find({ ShopId });

            if (!orders.length) {
                return res.status(404).json({
                    success: false,
                    message: 'No orders found for the provided ShopId',
                });
            }

            // Filter orders based on the provided status
            let filteredOrders = [];

            if (status === 'OrderPlace') {
                // Filter orders where at least one product has OrderStatus as "Pending"
                filteredOrders = orders.filter(order =>
                    order.ProductDetails.some(product => product.dispatchShippingDetails.OrderStatus === 'Pending')
                );
            } else if (status === 'delivered') {
                // Filter orders where at least one product has DispatchStatus as "Completed"
                filteredOrders = orders.filter(order =>
                    order.ProductDetails.some(product => product.dispatchShippingDetails.DispatchStatus === 'Completed')
                );
            } else if (status === 'cancelled') {
                // Filter orders where at least one product has OrderStatus as "Cancelled"
                filteredOrders = orders.filter(order =>
                    order.ProductDetails.some(product => product.dispatchShippingDetails.OrderStatus === 'Cancelled')
                );
            } else if (status === 'returned') {
                // Filter orders where at least one product has DispatchStatus as "Return"
                filteredOrders = orders.filter(order =>
                    order.ProductDetails.some(product => product.dispatchShippingDetails.DispatchStatus === 'Return')
                );
            } else {
                // If no valid status is provided, return all orders
                filteredOrders = orders;
            }

            if (filteredOrders.length > 0) {
                res.status(200).json({
                    success: true,
                    message: 'Orders found',
                    OrderList: filteredOrders,
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: `No orders found for the status: ${status}`,
                    OrderList: [],
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Server error',
                error: error.message,
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
    // GetOrderDetailsForReturn: async (req, res) => {
    //     try {
    //         const { orderId} = req.body;


    //         // Find the order based on orderId
    //         const order = await Order.findOne({ orderId });
    //         if (!order) {
    //             return res.status(404).json({ result: false, statusCode: 404, message: 'Order not found.' });
    //         }



    //         // Extract customerInfo
    //         const customerInfo = order.customerInfo;

    //         res.status(200).json({
    //             result: true,
    //             statusCode: 200,
    //             message: 'Order details fetched successfully.',
    //             orderId: order.orderId,
    //             Total: order.Total,
    //             PaymentDoneAmount: order.PaymentDoneAmount,
    //             PaymentMethod: order.PaymentMethod,
    //             Duepayment: order.Duepayment,
    //             ProductDetails: order.ProductDetails,
    //             customerInfo: customerInfo,
    //         });
    //     } catch (err) {
    //         console.error('Error in GetOrderDetails:', err);
    //         res.status(500).json({ error: err.message });
    //     }
    // },


    GetOrderDetailsForReturn: async (req, res) => {
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
        const { orderId, productId, uniqueCode, shopEmail, emailToggle } = req.body;

        try {
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

            // Update product details
            product.dispatchShippingDetails.OrderStatus = 'Shipped';
            product.OrderTrackingDetails.Place = true;
            product.dispatchShippingDetails.DispatchStatus = 'pending';
            product.dispatchShippingDetails.DispatchID = uniqueCode;

            // Save the updated order
            const updatedOrder = await order.save();

            // Send email if emailToggle is true
            if (emailToggle) {
                const mailOptions = {
                    from: 'sumitpathakofficial914@gmail.com',
                    to: shopEmail, // Send to the shop email
                    subject: 'Order Confirmation',
                    text: `Your order with Order ID: ${orderId} and Product ID: ${productId} has been successfully shipped. Dispatch ID: ${uniqueCode}. Thank you for shopping with us!`
                };

                // Send the email using Nodemailer
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error('Error sending email:', error);
                        return res.status(500).json({ message: 'Failed to send email', error });
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
            }

            // Send response
            res.json({ message: 'Order status updated successfully' });
        } catch (error) {
            console.error('Error updating order status:', error);
            res.status(500).json({ message: 'Server error', error });
        }
    },
    handleOrderActionUpdateAndCancel: async (req, res) => {
        const { modelAction, orderId, productId, reason, shopEmail, sendEmail } = req.body;

        // Validate the required fields
        if (!modelAction || !orderId || !productId || !reason) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        try {
            // Find the order by orderId
            const order = await Order.findOne({ orderId });

            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            // Find the product within the order by productId
            const product = order.ProductDetails.find(p => p.ProductID === productId);

            if (!product) {
                return res.status(404).json({ message: 'Product not found in order' });
            }

            // Handle "Pending" action
            if (modelAction === 'Pending') {
                product.dispatchShippingDetails.OrderPendingReason = reason;
                product.dispatchShippingDetails.OrderStatus = modelAction;
                product.dispatchShippingDetails.OrderCancelReason = "";

                // Check if sendEmail is true, and send a "Pending" status email
                if (sendEmail) {
                    const mailOptions = {
                        from: 'sumitpathakofficial914@gmail.com',
                        to: shopEmail,
                        subject: 'Order Pending Notification',
                        text: `Dear Customer, your order with Order ID: ${orderId} and Product ID: ${productId} is currently pending. Reason: ${reason}.`
                    };

                    // Send the email
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.error('Error sending pending email:', error);
                        } else {
                            console.log('Pending email sent: ' + info.response);
                        }
                    });
                }

                // Handle "Cancel" action
            } else if (modelAction === 'Cancel') {
                product.dispatchShippingDetails.OrderPendingReason = "";
                product.dispatchShippingDetails.OrderCancelReason = reason;
                product.dispatchShippingDetails.OrderStatus = "Canceled";

                // Check if sendEmail is true, and send a "Cancellation" status email
                if (sendEmail) {
                    const mailOptions = {
                        from: 'sumitpathakofficial914@gmail.com',
                        to: shopEmail,
                        subject: 'Order Cancellation Notification',
                        text: `Dear Customer, your order with Order ID: ${orderId} and Product ID: ${productId} has been canceled. Reason: ${reason}. We apologize for the inconvenience.`
                    };

                    // Send the email
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.error('Error sending cancellation email:', error);
                        } else {
                            console.log('Cancellation email sent: ' + info.response);
                        }
                    });
                }

            } else {
                return res.status(400).json({ error: 'Invalid model action' });
            }

            // Save the updated order
            await order.save();

            // Send success response
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
    getDispatchingOrdersByFactory: async (req, res) => {
        try {
            const { factoryId } = req.params; // Assuming factoryId is passed as a URL parameter

            // Fetch orders that contain any product with the matching factoryId in SupplierInfo
            const orders = await Order.find({ 'ProductDetails.SupplierInfo.FactoryId': factoryId });

            // Collect only products from the matching factoryId
            const filteredProducts = [];

            orders.forEach(order => {
                // Filter products that match the factoryId and have an OrderStatus of 'Shipped'
                const matchingProducts = order.ProductDetails.filter(product => {
                    return product.SupplierInfo.FactoryId === factoryId && product.dispatchShippingDetails?.OrderStatus === 'Shipped';
                });

                // For each matching product, push only the relevant fields
                matchingProducts.forEach(product => {
                    filteredProducts.push({
                        ProductID: product.ProductID,
                        OrderDate: product.OrderDate,
                        ProductName: product.ProductName,
                        MRP: product.MRP,
                        discount: product.discount,
                        selection: product.selection,
                        dispatchShippingDetails: product.dispatchShippingDetails,
                        orderId: order.orderId,
                        customerInfo: order.customerInfo,
                        Duepayment: order.Duepayment,
                        selectedImages: product.selectedImages,
                        SupplierInfo: product.SupplierInfo
                    });
                });
            });

            res.json({
                result: true,
                statusCode: 200,
                message: 'Dispatch Product List retrieved successfully for factory ' + factoryId,
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
            if (order.Duepayment === "0") {
                product.OrderTrackingDetails.payment = true;
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
