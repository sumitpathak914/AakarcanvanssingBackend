const Dealer = require('../model/DealerModel'); // Shops
const Factory = require('../model/FactoryListModel');
const Product = require('../model/AddProductModel');
const User = require('../model/userModel'); // Users for role-based filtering
const Order = require('../model/OrderManagmentandDispatchModel'); // Orders
const PurchaseReturn = require('../model/PurchaseReturnModel'); // Purchase Return model

// Controller to get the counts
exports.getCounts = async (req, res) => {
    try {
        // Count total number of dealers (shops) where role is 'Dealer'
        const dealerCount = await Dealer.countDocuments();

        // Count total number of factories where role is 'Factory'
        const factoryCount = await User.countDocuments({ role: 'Factory' });

        // Count total number of products
        const allProductCount = await Product.countDocuments();

        // Count total number of active products where action is "1"
        const activeProductCount = await Product.countDocuments({ action: "1" });

        // Count total number of orders
        const allOrderCount = await Order.countDocuments();

        // Get all orders to calculate product-level counts
        const orders = await Order.find({}, 'ProductDetails');

        // Initialize product counts
        let totalProductCount = 0;
        let pendingProductCount = 0;
        let canceledProductCount = 0;
        let completedProductCount = 0;

        // Loop through all orders and count individual products, pending products, canceled products, and completed products
        orders.forEach(order => {
            order.ProductDetails.forEach(product => {
                totalProductCount++; // Count every product in the order

                // Check if product's OrderStatus is 'Pending'
                if (product.dispatchShippingDetails?.OrderStatus === 'Pending') {
                    pendingProductCount++;
                }

                // Check if product's OrderStatus is 'Canceled'
                if (product.dispatchShippingDetails?.OrderStatus === 'Canceled') {
                    canceledProductCount++;
                }

                // Check if product's DispatchStatus is 'Completed'
                if (product.dispatchShippingDetails?.DispatchStatus === 'Completed') {
                    completedProductCount++;
                }
            });
        });

        // Initialize return counts
        let refundProductCount = 0;
        let pendingReturnProductCount = 0;
        let rejectedReturnProductCount = 0;

        // Get all purchase returns to check return statuses
        const purchaseReturns = await PurchaseReturn.find({});

        // Loop through purchase returns and check productDetails for return status
        purchaseReturns.forEach(purchaseReturn => {
            if (Array.isArray(purchaseReturn.productDetails)) {
                purchaseReturn.productDetails.forEach(product => {
                    if (product.returnStatus === 'Refund') {
                        refundProductCount++;
                    }
                    if (product.returnStatus === 'Pending') {
                        pendingReturnProductCount++;
                    }
                    if (product.returnStatus === 'Rejected') {
                        rejectedReturnProductCount++;
                    }
                });
            }
        });

        // Respond with the counts
        return res.status(200).json({
            success: true,
            data: {
                dealerCount,
                factoryCount,
                allProductCount,
                activeProductCount,
                allOrderCount,
                totalProductCount, // Total count of individual products
                pendingProductCount, // Count of pending products
                canceledProductCount, // Count of canceled products
                completedProductCount, // Count of completed products
                refundProductCount, // Count of refund products from purchase returns
                pendingReturnProductCount, // Count of pending returns from purchase returns
                rejectedReturnProductCount // Count of rejected returns from purchase returns
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve counts',
            error: error.message
        });
    }
};
