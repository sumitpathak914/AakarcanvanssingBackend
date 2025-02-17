const Order = require('../model/FactorytofactoryModel');
const TransactionRecord = require('../model/FactorytoFactoryTrsaction');
const { v4: uuidv4 } = require('uuid');
const Notification = require('../model/FactoryNotification');

const FactoryToFactoryController = {

    // CreateOrder: async (req, res) => {
    //     try {
    //         // Destructure the relevant fields from the request body
    //         const { orderId, Total, PaymentMethod, PaymentDoneAmount, Duepayment, ProductDetails, customerInfo } = req.body;

    //         // Determine which payment details to include based on PaymentMethod
    //         const transactionData = {
    //             PaymentDoneAmount,
    //             Duepayment,
    //             Total,
    //             PaymentMethod,

    //         };

    //         // Create a new Order instance with the payment details
    //         const order = new Order(req.body);

    //         await order.save();


    //         // Create a new TransactionRecord instance with the extracted data
    //         const transactionRecord = new TransactionRecord({
    //             orderId,
    //             Date: new Date(), // Use the current date or provide a specific date
    //             Total,
    //             customerInfo,
    //             PaymentMethod,
    //             ProductDetails,

    //             // TransactionData: [transactionData] // Add the constructed array here
    //         });

    //         // Save the transaction record to the database
    //         await transactionRecord.save();
    //         const notifications = [
    //             {
    //                 factoryId: customerInfo.FactoryID,
    //                 message: `Your order ${orderId} has been successfully placed.`
    //             },
    //             {
    //                 factoryId: customerInfo.supplierFactoryId,
    //                 message: `A new order ${orderId} has been placed for your products.`
    //             }
    //         ];

    //         await Notification.insertMany(notifications);

    //         // Respond with a success message
    //         res.status(201).json({ result: true, statusCode: 201, message: 'Order created successfully.' });
    //     } catch (err) {
    //         // Respond with an error message
    //         res.status(400).json({ result: false, statusCode: 400, error: err.message });
    //     }
    // },


    // CreateOrder: async (req, res) => {
    //     try {
    //         const { orderId, Total, PaymentMethod, PaymentDoneAmount, Duepayment, ProductDetails, customerInfo } = req.body;

    //         // Create a new Order instance with the payment details
    //         const order = new Order(req.body);
    //         await order.save();

    //         // Create a new TransactionRecord instance with the extracted data
    //         const transactionRecord = new TransactionRecord({
    //             orderId,
    //             Date: new Date(),
    //             Total,
    //             customerInfo,
    //             PaymentMethod,
    //             ProductDetails
    //         });

    //         await transactionRecord.save();

    //         // Notifications array
    //         const notifications = [];

    //         // Customer Notification
    //         notifications.push({
    //             factoryId: customerInfo.FactoryID,
    //             message: `A new order ${orderId} has been placed for your product. `
    //         });
    //         ProductDetails.forEach(product => {
    //             if (product.SupplierInfo?.FactoryId) {
    //                 notifications.push({
    //                     factoryId: product.SupplierInfo.FactoryId,
    //                     message: `You have received a new order request (Order ID: ${orderId}) from ${customerInfo.FactoryName} for your product ${product.ProductName} (Product ID: ${product.ProductID}). Please review and process the order.`
    //                 });
    //             }
    //         });
    //         await Notification.insertMany(notifications);

    //         // Respond with success
    //         res.status(201).json({ result: true, statusCode: 201, message: 'Order created successfully and notifications sent.' });
    //     } catch (err) {
    //         res.status(400).json({ result: false, statusCode: 400, error: err.message });
    //     }
    // },
    CreateOrder: async (req, res) => {
        try {
            const { orderId, Total, PaymentMethod, PaymentDoneAmount, Duepayment, ProductDetails, customerInfo } = req.body;

            // Create a new Order instance with the payment details
            const order = new Order(req.body);
            await order.save();

            // Create a new TransactionRecord instance with the extracted data
            const transactionRecord = new TransactionRecord({
                orderId,
                Date: new Date(),
                Total,
                customerInfo,
                PaymentMethod,
                ProductDetails
            });

            await transactionRecord.save();

            // Notifications array
            const notifications = [];

            // Customer Notification
            notifications.push({
                factoryId: customerInfo.FactoryID,
                message: `A new order ${orderId} has been placed for your product.`,
                status: 0 // Unread notification
            });

            ProductDetails.forEach(product => {
                if (product.SupplierInfo?.FactoryId) {
                    notifications.push({
                        factoryId: product.SupplierInfo.FactoryId,
                        message: `You have received a new order request (Order ID: ${orderId}) from ${customerInfo.FactoryName} for your product ${product.ProductName} (Product ID: ${product.ProductID}). Please review and process the order.`,
                        status: 0 // Unread notification
                    });
                }
            });

            await Notification.insertMany(notifications);

            // Respond with success
            res.status(201).json({ result: true, statusCode: 201, message: 'Order created successfully and notifications sent.' });
        } catch (err) {
            res.status(400).json({ result: false, statusCode: 400, error: err.message });
        }
    },

    GetProductsByFactoryId: async (req, res) => {
        try {
            const { factoryId } = req.query; // Get factoryId from request parameters

            if (!factoryId) {
                return res.status(400).json({ result: false, statusCode: 400, message: 'Factory ID is required.' });
            }

            // Fetch orders that contain products with matching SupplierInfo.FactoryId
            const orders = await Order.find({
                'ProductDetails.SupplierInfo.FactoryId': factoryId
            });

            // Extract matching products along with their order IDs and Factorycustomer
            let matchingProducts = [];
            orders.forEach(order => {
                const filteredProducts = order.ProductDetails
                    .filter(product => product.SupplierInfo && product.SupplierInfo.FactoryId === factoryId)
                    .map(product => ({
                        ...product.toObject(), // Convert Mongoose object to plain JS object
                        orderId: order.orderId, // Use correct order ID field
                        duePayment: order.Duepayment || null,
                        Factorycustomer: order.customerInfo || null // Include customerInfo, default to null if not present
                    }));

                matchingProducts.push(...filteredProducts);
            });

            if (matchingProducts.length === 0) {
                return res.status(404).json({ result: false, statusCode: 404, message: 'No products found for this Factory ID.' });
            }

            // Send response with matching products including order IDs and Factorycustomer
            res.status(200).json({ result: true, statusCode: 200, data: matchingProducts });
        } catch (err) {
            res.status(500).json({ result: false, statusCode: 500, error: err.message });
        }
    },
    GetProductsByCustomerFactoryId: async (req, res) => {
        try {
            const { factoryId } = req.query; // Get factoryId from request parameters

            if (!factoryId) {
                return res.status(400).json({ result: false, statusCode: 400, message: 'Factory ID is required.' });
            }

            // Fetch orders where customerInfo.FactoryID matches the given factoryId
            const orders = await Order.find({
                'customerInfo.FactoryID': factoryId
            });

            if (!orders.length) {
                return res.status(404).json({ result: false, statusCode: 404, message: 'No orders found for this Factory ID.' });
            }

            // Extract products separately along with order ID and customer details
            let productList = [];
            orders.forEach(order => {
                const products = order.ProductDetails.map(product => ({
                    ...product.toObject(), // Convert Mongoose object to plain JS object
                    orderId: order.orderId, // Include order ID
                    totalAmount: order.Total, // Include total order amount
                    paymentDone: order.PaymentDoneAmount, // Include payment done amount
                    duePayment: order.Duepayment, // Include due payment amount
                    customerFactoryInfo: {
                        FactoryID: order.customerInfo.FactoryID,
                        CustomerFactoryName: order.customerInfo.CustomerFactoryName,
                        FactoryName: order.customerInfo.FactoryName,
                        FactoryContactNo: order.customerInfo.FactoryContactNo,
                        FactoryEmailID: order.customerInfo.FactoryEmailID,
                        Billing_Address: order.customerInfo.Billing_Address,
                        Shipping_Address: order.customerInfo.Shipping_Address,
                        FactorygstNumber: order.customerInfo.FactorygstNumber,
                        FactoryFSSAINumber: order.customerInfo.FactoryFSSAINumber
                    }
                }));

                productList.push(...products);
            });

            // Send response with separate product list
            res.status(200).json({ result: true, statusCode: 200, data: productList });
        } catch (err) {
            res.status(500).json({ result: false, statusCode: 500, error: err.message });
        }
    },
    UpdateTheOrderStatus: async (req, res) => {
        const { orderId, productId, uniqueCode, status, statusNote } = req.body;

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

            // Update Order Tracking Details
            if (status === "Placed") {
                product.OrderTrackingDetails.Place = true;
                product.OrderTrackingDetails.PlaceNote = statusNote || "Order placed successfully.";
            }
            else if (status === "Shipped") {
                product.OrderTrackingDetails.Shipped = true;
                product.OrderTrackingDetails.ShippedNote = statusNote || "Order has been shipped.";
                product.dispatchShippingDetails.OrderStatus = "Shipped";
            }
            else if (status === "Out_for_Delivery") {
                product.OrderTrackingDetails.Out_for_Delivery = true;
                product.OrderTrackingDetails.Out_for_Delivery_Note = statusNote || "Order is out for delivery.";
            }
            else if (status === "Delivered") {
                // Set all OrderTrackingDetails flags to true
                product.OrderTrackingDetails.Place = true;
                product.OrderTrackingDetails.Shipped = true;
                product.OrderTrackingDetails.Out_for_Delivery = true;
                product.OrderTrackingDetails.Delivered = true;

                // Add notes for each tracking step
                product.OrderTrackingDetails.PlaceNote = statusNote || "Order placed successfully.";
                product.OrderTrackingDetails.ShippedNote = statusNote || "Order has been shipped.";
                product.OrderTrackingDetails.Out_for_Delivery_Note = statusNote || "Order is out for delivery.";
                product.OrderTrackingDetails.DeliveredNote = statusNote || "Order delivered successfully.";

                product.dispatchShippingDetails.DispatchStatus = "delivered";
                product.dispatchShippingDetails.DispatchID = uniqueCode;
            }

            // Save the updated order
            await order.save();
            res.json({ message: "Order tracking updated successfully." });

        } catch (error) {
            console.error("Error updating order tracking:", error);
            res.status(500).json({ message: "Server error", error });
        }
    },



    // getTransactionByOrderId: async (req, res) => {
    //     try {
    //         const { orderId } = req.body;

    //         // Find transaction record by orderId and return only TransactionData
    //         const transactionRecord = await TransactionRecord.findOne({ orderId });

    //         if (!transactionRecord) {
    //             return res.status(404).json({ result: false, statusCode: 404, message: 'No transaction found for this order ID.' });
    //         }

    //         // Extract only TransactionData
    //         const transactionData = transactionRecord.TransactionData;

    //         res.status(200).json({ result: true, statusCode: 200, data: transactionData });
    //     } catch (err) {
    //         res.status(500).json({ result: false, statusCode: 500, error: err.message });
    //     }
    // },

    getTransactionByOrderId: async (req, res) => {
        try {
            const { orderId, productid } = req.body;

            if (!orderId || !productid) {
                return res.status(400).json({ result: false, statusCode: 400, message: 'orderId and productid are required.' });
            }

            // Find the transaction record by orderId
            const transactionRecord = await TransactionRecord.findOne({ orderId });

            if (!transactionRecord) {
                return res.status(404).json({ result: false, statusCode: 404, message: 'No transaction found for this order ID.' });
            }

            // Filter the ProductDetails to find the matching product
            const productTransaction = transactionRecord.ProductDetails.find(
                (product) => product.ProductID === productid
            );

            if (!productTransaction) {
                return res.status(404).json({ result: false, statusCode: 404, message: 'No transaction found for this product ID.' });
            }

            res.status(200).json({ result: true, statusCode: 200, data: productTransaction });
        } catch (err) {
            res.status(500).json({ result: false, statusCode: 500, error: err.message });
        }
    },




    // addTransaction: async (req, res) => {
    //     try {
    //         const { orderId, productId, type, amount, date } = req.body;
    //         const paymentAmount = parseFloat(amount);

    //         // Find the order
    //         const order = await Order.findOne({ orderId });
    //         if (!order) {
    //             return res.status(404).json({ result: false, statusCode: 404, message: "Order not found." });
    //         }

    //         // Check if payment amount exceeds Duepayment
    //         if (paymentAmount > parseFloat(order.Duepayment)) {
    //             return res.status(400).json({ result: false, statusCode: 400, message: "Payment amount exceeds due amount." });
    //         }

    //         // Deduct the amount from order's Duepayment
    //         order.Duepayment = (parseFloat(order.Duepayment) - paymentAmount).toFixed(2);
    //         await order.save();

    //         // Find transaction record
    //         const transactionRecord = await TransactionRecord.findOne({ orderId });
    //         if (!transactionRecord) {
    //             return res.status(404).json({ result: false, statusCode: 404, message: "No transaction found for this order ID." });
    //         }

    //         // Update transaction record
    //         const updatedDuepayment = (parseFloat(transactionRecord.Duepayment) - paymentAmount).toFixed(2);
    //         transactionRecord.TransactionData.push({
    //             PaymentMethod: type,
    //             PaymentDoneAmount: paymentAmount.toFixed(2),
    //             Duepayment: updatedDuepayment,
    //             Total: transactionRecord.Total,
    //             TransactionDate: new Date(date),
    //         });

    //         // Update Duepayment in TransactionRecord model
    //         transactionRecord.Duepayment = updatedDuepayment;
    //         await transactionRecord.save();

    //         res.status(201).json({ result: true, statusCode: 201, message: "Transaction added successfully.", data: transactionRecord });

    //     } catch (err) {
    //         res.status(500).json({ result: false, statusCode: 500, error: err.message });
    //     }
    // },




    // generateFactoryToFactoryInvoice: async (req, res) => {
    //     const { factoryId, startDate, endDate } = req.body;
    //     console.log("Request Body:", req.body); // Log the incoming request body

    //     try {
    //         const start = new Date(startDate);
    //         const end = new Date(endDate);
    //         end.setHours(23, 59, 59, 999); // Ensure the end date includes the entire day

    //         console.log("Start Date:", start);
    //         console.log("End Date:", end);

    //         // Fetch FactoryToFactory orders within the date range
    //         const orders = await Order.find({
    //             "ProductDetails": {
    //                 $elemMatch: {
    //                     "OrderDate": {
    //                         $gte: new Date(startDate).toISOString().slice(0, 10), // Convert startDate to "YYYY-MM-DD"
    //                         $lte: new Date(endDate).toISOString().slice(0, 10)    // Convert endDate to "YYYY-MM-DD"
    //                     }
    //                 }
    //             }
    //         });


    //         if (!orders.length) {
    //             return res.status(404).json({ message: "No orders found for the selected date range." });
    //         }

    //         let commissionData = [];

    //         // Process orders
    //         orders.forEach(order => {
    //             let totalSellingCommission = 0;
    //             let totalPurchaseCommission = 0;
    //             let filteredProductDetails = [];

    //             order.ProductDetails.forEach(product => {
    //                 const orderDate = new Date(product.OrderDate); // Ensure this is a Date object
    //                 console.log("Product Order Date:", orderDate); // Log the order date for debugging

    //                 const supplierFactoryId = product.SupplierInfo.FactoryId;
    //                 const customerFactoryId = order.customerInfo.FactoryID;

    //                 // Ensure correct date comparison and filter orders by factoryId
    //                 if (
    //                     orderDate >= start &&
    //                     orderDate <= end &&
    //                     product.OrderTrackingDetails?.Delivered &&
    //                     (supplierFactoryId === factoryId || customerFactoryId === factoryId)
    //                 ) {
    //                     let productTotalSellingCommission = 0;
    //                     let productTotalPurchaseCommission = 0;

    //                     if (product.selection && Array.isArray(product.selection)) {
    //                         product.selection.forEach(selection => {
    //                             const size = selection.size;
    //                             const quantity = selection.quantity;
    //                             let commissionRate = 0;

    //                             if (size === "30kg") commissionRate = product.commission.supplier30Kg;
    //                             else if (size === "50kg") commissionRate = product.commission.supplier50Kg;
    //                             else if (size === "25kg") commissionRate = product.commission.supplier25Kg;
    //                             else if (size === "100kg") commissionRate = product.commission.supplier100Kg;

    //                             const totalCommission = commissionRate ? commissionRate * quantity : 0;
    //                             productTotalSellingCommission += totalCommission;
    //                             productTotalPurchaseCommission += totalCommission;
    //                         });
    //                     }

    //                     totalSellingCommission += productTotalSellingCommission;
    //                     totalPurchaseCommission += productTotalPurchaseCommission;

    //                     filteredProductDetails.push({
    //                         ...product._doc,
    //                         productTotalSellingCommission: productTotalSellingCommission.toFixed(2),
    //                         productTotalPurchaseCommission: productTotalPurchaseCommission.toFixed(2),
    //                     });
    //                 }
    //             });

    //             if (filteredProductDetails.length > 0) {
    //                 commissionData.push({
    //                     orderId: order.orderId,
    //                     customerFactoryId: order.customerInfo.FactoryID,
    //                     supplierFactoryId: order.ProductDetails[0]?.SupplierInfo.FactoryId,
    //                     totalSellingCommission: totalSellingCommission.toFixed(2),
    //                     totalPurchaseCommission: totalPurchaseCommission.toFixed(2),
    //                     ProductDetails: filteredProductDetails,
    //                     customerInfo: order.customerInfo
    //                 });
    //             }
    //         });

    //         if (commissionData.length === 0) {
    //             return res.status(404).json({ message: "No orders found for the selected criteria." });
    //         }

    //         res.json({ message: "List fetched successfully", orders: commissionData });
    //     } catch (error) {
    //         console.error("Error fetching orders:", error);
    //         res.status(500).json({ message: "An error occurred while fetching orders." });
    //     }
    // }
    addTransaction: async (req, res) => {
        try {
            const { orderId, productId, type, amount, date } = req.body;
            const paymentAmount = parseFloat(amount);

            // Find the order
            const order = await Order.findOne({ orderId });
            if (!order) {
                return res.status(404).json({ result: false, statusCode: 404, message: "Order not found." });
            }

            // Find the specific product inside ProductDetails
            const product = order.ProductDetails.find(p => p.ProductID === productId);
            if (!product) {
                return res.status(404).json({ result: false, statusCode: 404, message: "Product not found in order." });
            }

            // Check if payment amount exceeds Duepayment
            if (paymentAmount > parseFloat(product.ProductDuePayment)) {
                return res.status(400).json({ result: false, statusCode: 400, message: "Payment amount exceeds due amount for this product." });
            }

            // Deduct the amount from product's Duepayment
            const updatedDuePayment = (parseFloat(product.ProductDuePayment) - paymentAmount).toFixed(2);
            product.ProductDuePayment = updatedDuePayment;

            await order.save();  // Save the updated order


            // Find transaction record
            // const transactionRecord = await TransactionRecord.findOne({ orderId });
            // if (!transactionRecord) {
            //     return res.status(404).json({ result: false, statusCode: 404, message: "No transaction found for this order ID." });
            // }

            // // Find the correct product inside TransactionData
            // const productTransaction = transactionRecord.ProductDetails.find(t => t.ProductID === productId);

            // if (!productTransaction) {
            //     return res.status(404).json({ result: false, statusCode: 404, message: "No transaction record found for this product ID." });
            // }

            // transactionRecord.TransactionData.push({
            //     PaymentMethod: type,
            //     PaymentDoneAmount: paymentAmount.toFixed(2),
            //     Duepayment: updatedDuePayment,
            //     Total: order.Total,
            //     TransactionDate: new Date(date)
            // });

            // // Save the updated transaction record
            // await transactionRecord.save();

            // res.status(201).json({ result: true, statusCode: 201, message: "Transaction added successfully.", data: transactionRecord });


            const transactionRecord = await TransactionRecord.findOne({ orderId });

            if (!transactionRecord) {
                return res.status(404).json({
                    result: false,
                    statusCode: 404,
                    message: "No transaction found for this order ID."
                });
            }

            // Find the correct product inside ProductDetails
            const productTransaction = transactionRecord.ProductDetails.find(t => t.ProductID === productId);

            if (!productTransaction) {
                return res.status(404).json({
                    result: false,
                    statusCode: 404,
                    message: "No transaction record found for this product ID."
                });
            }

            // Ensure the TransactionData array exists
            if (!productTransaction.TransactionData) {
                productTransaction.TransactionData = [];
            }

            // Create a new transaction object
            const newTransaction = {
                TransactionID: uuidv4(), // Generate a unique UUID for the transaction
                PaymentMethod: type,
                PaymentDoneAmount: paymentAmount.toFixed(2),
                Duepayment: updatedDuePayment,
                Total: transactionRecord.Total, // Ensure total matches the order's total
                TransactionDate: new Date().toISOString(), // Use standardized format
            };

            // Push the new transaction into the TransactionData array
            productTransaction.TransactionData.push(newTransaction);

            // Save the updated transaction record
            await transactionRecord.save();

            res.status(201).json({
                result: true,
                statusCode: 201,
                message: "Transaction added successfully.",
                data: transactionRecord
            });

        } catch (err) {
            res.status(500).json({ result: false, statusCode: 500, error: err.message });
        }
    },
    generateFactoryToFactoryInvoice: async (req, res) => {
        const { factoryId, startDate, endDate } = req.body;
        console.log("Request Body:", req.body); // Log the incoming request body

        try {
            let dateFilter = {};

            if (startDate && endDate) {
                const start = new Date(startDate);
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999); // Ensure the end date includes the entire day

                console.log("Start Date:", start);
                console.log("End Date:", end);

                // Apply date filtering only if both startDate and endDate are provided
                dateFilter = {
                    "ProductDetails": {
                        $elemMatch: {
                            "OrderDate": {
                                $gte: new Date(startDate).toISOString().slice(0, 10),
                                $lte: new Date(endDate).toISOString().slice(0, 10),
                            }
                        }
                    }
                };
            }

            // Fetch FactoryToFactory orders based on the date filter
            const orders = await Order.find(dateFilter);

            if (!orders.length) {
                return res.status(404).json({ message: "No orders found for the selected date range." });
            }

            let commissionData = [];

            // Process orders
            orders.forEach(order => {
                let totalSellingCommission = 0;
                let totalPurchaseCommission = 0;
                let filteredProductDetails = [];

                order.ProductDetails.forEach(product => {
                    const orderDate = new Date(product.OrderDate);
                    console.log("Product Order Date:", orderDate); // Log the order date for debugging

                    const supplierFactoryId = product.SupplierInfo.FactoryId;
                    const customerFactoryId = order.customerInfo.FactoryID;

                    // If date range is provided, filter by date; otherwise, include all data
                    if (
                        (!startDate || !endDate || (orderDate >= new Date(startDate) && orderDate <= new Date(endDate))) &&
                        product.OrderTrackingDetails?.Delivered &&
                        (supplierFactoryId === factoryId || customerFactoryId === factoryId)
                    ) {
                        let productTotalSellingCommission = 0;
                        let productTotalPurchaseCommission = 0;

                        if (product.selection && Array.isArray(product.selection)) {
                            product.selection.forEach(selection => {
                                const size = selection.size;
                                const quantity = selection.quantity;
                                let commissionRate = 0;

                                if (size === "30kg") commissionRate = product.commission.supplier30Kg;
                                else if (size === "50kg") commissionRate = product.commission.supplier50Kg;
                                else if (size === "25kg") commissionRate = product.commission.supplier25Kg;
                                else if (size === "100kg") commissionRate = product.commission.supplier100Kg;

                                const totalCommission = commissionRate ? commissionRate * quantity : 0;
                                productTotalSellingCommission += totalCommission;
                                productTotalPurchaseCommission += totalCommission;
                            });
                        }

                        totalSellingCommission += productTotalSellingCommission;
                        totalPurchaseCommission += productTotalPurchaseCommission;

                        filteredProductDetails.push({
                            ...product._doc,
                            productTotalSellingCommission: productTotalSellingCommission.toFixed(2),
                            productTotalPurchaseCommission: productTotalPurchaseCommission.toFixed(2),
                        });
                    }
                });

                if (filteredProductDetails.length > 0) {
                    commissionData.push({
                        orderId: order.orderId,
                        customerFactoryId: order.customerInfo.FactoryID,
                        supplierFactoryId: order.ProductDetails[0]?.SupplierInfo.FactoryId,
                        totalSellingCommission: totalSellingCommission.toFixed(2),
                        totalPurchaseCommission: totalPurchaseCommission.toFixed(2),
                        ProductDetails: filteredProductDetails,
                        customerInfo: order.customerInfo
                    });
                }
            });

            if (commissionData.length === 0) {
                return res.status(404).json({ message: "No orders found for the selected criteria." });
            }

            res.json({ message: "List fetched successfully", orders: commissionData });
        } catch (error) {
            console.error("Error fetching orders:", error);
            res.status(500).json({ message: "An error occurred while fetching orders." });
        }
    },
    GetFactoryNotifications: async (req, res) => {
        try {
            const { factoryId } = req.params;


            if (!factoryId) {
                return res.status(400).json({ result: false, statusCode: 400, error: "Factory ID is required" });
            }


            const notifications = await Notification.find({ factoryId }).sort({ createdAt: -1 });


            res.status(200).json({ result: true, statusCode: 200, notifications });
        } catch (err) {
            res.status(500).json({ result: false, statusCode: 500, error: err.message });
        }
    },
    resetNotificationStatus: async (req, res) => {
        try {
            const { factoryId } = req.body;

            // Validate if factoryId exists
            if (!factoryId || typeof factoryId !== 'string') {
                return res.status(400).json({
                    result: false,
                    statusCode: 400,
                    message: 'Valid Factory ID is required.'
                });
            }

            // Find unread notifications (status 0) for the factory
            const unreadNotifications = await Notification.find({
                factoryId,
                status: 0
            });

            // If no unread notifications are found, return a 404 error
            if (unreadNotifications.length === 0) {
                return res.status(404).json({
                    result: false,
                    statusCode: 404,
                    message: 'No unread notifications found for this factory.'
                });
            }

            // Update notifications to mark them as read (status 1)
            const updated = await Notification.updateMany(
                { factoryId, status: 0 },
                { $set: { status: 1 } }
            );

            // If no notifications were updated, it might be an issue with the query
            if (updated.modifiedCount === 0) {
                return res.status(500).json({
                    result: false,
                    statusCode: 500,
                    message: 'Failed to mark notifications as read.'
                });
            }

            // Success response
            res.status(200).json({
                result: true,
                statusCode: 200,
                message: 'Unread notifications marked as read for the factory.'
            });

        } catch (err) {
            // General error handling
            res.status(500).json({
                result: false,
                statusCode: 500,
                error: err.message
            });
        }
    },

     deleteNotification : async (req, res) => {
        try {
            const { notificationId, factoryId } = req.body;  // Extract data from body

            // Validate if both notificationId and factoryId are provided
            if (!notificationId || !factoryId) {
                return res.status(400).json({
                    result: false,
                    statusCode: 400,
                    message: 'Both Notification ID and Factory ID are required.',
                });
            }

            // Ensure notificationId is a valid ObjectId
            // if (!mongoose.Types.ObjectId.isValid(notificationId)) {
            //     return res.status(400).json({
            //         result: false,
            //         statusCode: 400,
            //         message: 'Invalid Notification ID format.',
            //     });
            // }

            // Find the notification by its notificationId and factoryId (as string)
            const notification = await Notification.findOne({
                _id: notificationId,
                factoryId: factoryId,  // Treat factoryId as string
            });

            // If the notification doesn't exist, return 404
            if (!notification) {
                return res.status(404).json({
                    result: false,
                    statusCode: 404,
                    message: 'Notification not found for the provided Factory ID.',
                });
            }

            // Delete the notification
            await Notification.findByIdAndDelete(notificationId);

            // Success response
            res.status(200).json({
                result: true,
                statusCode: 200,
                message: 'Notification deleted successfully.',
            });
        } catch (err) {
            // General error handling
            res.status(500).json({
                result: false,
                statusCode: 500,
                error: err.message,
            });
        }
    },


};

module.exports = FactoryToFactoryController;