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

exports.getProductCountsByFactory = async (req, res) => {
    try {
        // Get the factory ID from the request parameters
        const { factoryId } = req.params;

        if (!factoryId) {
            return res.status(400).json({
                success: false,
                message: 'Factory ID is required'
            });
        }

        // Get all orders that contain products from the specified factory
        const orders = await Order.find({
            'ProductDetails.SupplierInfo.FactoryId': factoryId // Match factory ID in SupplierInfo
        }, 'ProductDetails');

        // Initialize counts for products based on their dispatch statuses
        let totalProductCount = 0;
        let pendingDispatchCount = 0;
        let deliveredCount = 0;
        let shippedCount = 0;

        // Loop through all orders and filter products by dispatch status
        orders.forEach(order => {
            order.ProductDetails.forEach(product => {
                if (product.SupplierInfo?.FactoryId === factoryId) {
                    totalProductCount++; // Count every product from the factory

                    // Check dispatch statuses
                    const dispatchStatus = product.dispatchShippingDetails?.DispatchStatus;
                    if (dispatchStatus === 'pending') pendingDispatchCount++;
                    if (dispatchStatus === 'Completed') deliveredCount++;
                    if (dispatchStatus === 'Dispatched') shippedCount++;
                }
            });
        });

        // Get all purchase returns related to this factory
        const purchaseReturns = await PurchaseReturn.find({
            'SupplierInfo.FactoryId': factoryId // Match factory ID in top-level supplier info
        });

        // Initialize return counts
        let pendingReturnCount = 0;
        let refundCount = 0;
        let rejectedReturnCount = 0;

        // Loop through purchase returns and check return statuses
        purchaseReturns.forEach(purchaseReturn => {
            purchaseReturn.productDetails.forEach(product => {
                // Check return statuses based on product details
                if (product.returnStatus === 'Pending') pendingReturnCount++;
                if (product.returnStatus === 'Refund') refundCount++;
                if (product.returnStatus === 'Rejected') rejectedReturnCount++;
            });
        });

        // Now, your pendingReturnCount, refundCount, and rejectedReturnCount are updated based on statuses


        // Return the counts based on the factory ID
        return res.status(200).json({
            success: true,
            data: {
                factoryId,
                // totalProductCount,        
                pendingDispatchCount,    
                deliveredCount,         
                shippedCount,             
                //pendingReturnCount,      
                refundCount,              
                //rejectedReturnCount      
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve product counts for the factory',
            error: error.message
        });
    }
};
