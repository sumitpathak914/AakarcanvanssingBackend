const PurchaseReturn = require('../model/PurchaseReturnModel');
const Order = require('../model/OrderManagmentandDispatchModel');
const TransactionRecord = require('../model/TrasactionsRecords'); 
// Add a new return order
const addReturnOrder = async (req, res) => {
    try {
        const {
            OrderId,
            OrderDate,
            productDetails,
            SupplierInfo,
            customerInfo,
            DuePayment,
            returnMessage,
            totalAmount,
            ShopId
        } = req.body;

        // Find the corresponding order by OrderId
        const existingOrder = await Order.findOne({ orderId: OrderId });

        if (!existingOrder) {
            return res.status(404).json({
                success: false,
                message: 'Order not found with the given OrderId'
            });
        }

        
       

        existingOrder.ReturnApply= true ;
 

        // Save the updated order
        await existingOrder.save();

        // Create a new return order
        const newPurchaseReturn = new PurchaseReturn({
            OrderId,
            OrderDate,
            productDetails,
            SupplierInfo,
            customerInfo,
            DuePayment,
            returnMessage,
            totalAmount,
            ShopId
        });

        // Save the return order
        await newPurchaseReturn.save();

        return res.status(201).json({
            success: true,
            message: 'Return order added successfully!',
            data: newPurchaseReturn,
            updatedOrder: existingOrder
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

const UpdateStatusofReturnProduct = async (req, res) => {
    try {
        const {
            orderId,
            productId,
            selectedActions,
            productTotalAmount, // The total amount of the product to be refunded
            rejectedReason
        } = req.body;

        // Find all orders that match the given orderId
        const orders = await PurchaseReturn.find({ OrderId: orderId });
        const ordersDetail = await Order.find({ orderId: orderId });

        // Find the transaction associated with the order
        const transactionRecords = await TransactionRecord.find({ orderId });

        // Check if orders exist
        if (!orders.length) {
            return res.status(404).json({
                success: false,
                message: 'No orders found with this Order ID',
            });
        }

        // Check if order details exist
        if (!ordersDetail.length) {
            return res.status(404).json({
                success: false,
                message: 'No order details found with this Order ID',
            });
        }

        // Check if transaction records exist
        if (!transactionRecords.length) {
            return res.status(404).json({
                success: false,
                message: 'No transaction records found with this Order ID',
            });
        }

        // Assuming we want to update the first transaction record
        const transactionRecord = transactionRecords[0];

        // Iterate through orders to find the specific product by matching ProductID
        let productFound = false;
        for (const order of orders) {
            const product = order.productDetails.find(item => item.ProductID === productId);

            if (product) {
                productFound = true;

                // Update return status based on selected action
                if (selectedActions === 'ApproveRefund') {
                    // Update return status of the specific product
                    product.returnStatus = 'Refund';

                    // Update the total and due payment in ordersDetail if the product ID matches
                    const orderDetail = ordersDetail[0];
                    const matchingProduct = orderDetail.ProductDetails.find(item => item.ProductID === productId);

                    if (matchingProduct) {
                        // Deduct the product total amount from Total and DuePayment
                        orderDetail.Total = (parseFloat(orderDetail.Total) - parseFloat(productTotalAmount)).toFixed(2);
                        orderDetail.Duepayment = (parseFloat(orderDetail.Duepayment) - parseFloat(productTotalAmount)).toFixed(2);
                        ordersDetail[0].ReturnApply = false;
                        // Update DispatchStatus to 'Return'
                        if (matchingProduct.dispatchShippingDetails) {
                            matchingProduct.dispatchShippingDetails.DispatchStatus = 'Return';
                        }

                        // Update the first transaction record's PaymentDoneAmount and Duepayment
                        if (transactionRecord.TransactionData.length > 0) {
                            const transactionData = transactionRecord.TransactionData[0];
                            transactionRecord.Total = (parseFloat(transactionData.Total) - parseFloat(productTotalAmount)).toFixed(2);
                            transactionData.Total = (parseFloat(transactionData.Total) - parseFloat(productTotalAmount)).toFixed(2);
                            transactionData.Duepayment = (parseFloat(transactionData.Duepayment) - parseFloat(productTotalAmount)).toFixed(2);
                        }
                    }
                } else if (selectedActions === 'RejectRefund') {
                    product.returnStatus = 'Rejected';
                    product.RejectedMessage = rejectedReason; 
                    ordersDetail[0].ReturnApply = false;
                } else {
                    product.returnStatus = 'Pending'; // Set to "Pending" if neither action is taken
                    ordersDetail[0].ReturnApply = true;
                }

                // Save the updated order and ordersDetail to the database
                await order.save();
                await ordersDetail[0].save(); // Save the updated order details
                await transactionRecord.save(); // Save the updated transaction record

                return res.status(200).json({
                    success: true,
                    message: 'Return status updated successfully!',
                    data: order
                });
            }
        }

        // If product was not found in any order
        if (!productFound) {
            return res.status(404).json({
                success: false,
                message: 'Product not found in any order with this Order ID',
            });
        }
    } catch (error) {
        console.error('Error updating return order:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update return order',
            error: error.message
        });
    }
};



const GetTheStatusOfReturnProduct = async (req, res) => {
    try {
        const { OrderId, ProductId } = req.body;
console.log(req.body)
        // Log the received parameters for debugging
        console.log(`Received OrderId: '${OrderId}'`);
        console.log(`Received ProductId: '${ProductId}'`);

        // Find all orders with the same OrderId
        const orders = await PurchaseReturn.find({ OrderId: OrderId });

        // Log retrieved orders
        console.log("Retrieved Orders:", orders);

        // Check if orders were found
        if (!orders || orders.length === 0) {
            console.log("No orders found for OrderId:", OrderId);
            return res.status(404).json({
                success: false,
                message: 'No orders found with this Order ID',
            });
        }

        // Loop through the orders to find the matching product by ProductId
        for (const order of orders) {
            const product = order.productDetails.find((item) => item.ProductID === ProductId);
            if (product) {
                return res.status(200).json({
                    success: true,
                    message: 'Return status retrieved successfully',
                    returnStatus: product.returnStatus,
                    rejectedMessage: product.RejectedMessage || '',
                });
            }
        }

        // If no matching product is found
        return res.status(404).json({
            success: false,
            message: 'Product not found in any order',
        });

    } catch (error) {
        console.error('Error retrieving return status:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve return status',
            error: error.message,
        });
    }
};








module.exports = { addReturnOrder, getAllReturnOrders, UpdateStatusofReturnProduct, GetTheStatusOfReturnProduct };
