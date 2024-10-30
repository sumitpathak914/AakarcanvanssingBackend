const Cart = require('../model/CartModel');
const Product = require('../model/AddProductModel'); // Assuming you need product details for price

// Add to Cart
const addToCart = async (req, res) => {
    try {
        const { ProductId, BagSizeAndQty, ShopId, price } = req.body;

        // Validate input
        if (!ProductId || !BagSizeAndQty || !ShopId || !price) {
            return res.status(400).json({ result: false, statusCode: 400, message: 'ProductId, BagSizeAndQty, ShopId, and price are required.' });
        }

        // Check if the product is already in the cart for this shop
        const existingCartItem = await Cart.findOne({ ProductId, ShopId });
        if (existingCartItem) {
            return res.status(400).json({ result: false, statusCode: 400, message: 'Product already in cart' });
        }

        // Calculate total price based on quantity, bag size, and price per kilogram
        let totalPrice = 0;

        BagSizeAndQty.forEach(item => {
            const sizeInKg = parseInt(item.size); // Convert size to a number (e.g., "30kg" to 30)
            totalPrice += sizeInKg * price * item.QTY;
        });

        // Create the cart object
        const cartItem = new Cart({
            ProductId,
            BagSizeAndQty,
            ShopId,
            TotalPrice: totalPrice
        });

        // Save to database
        await cartItem.save();

        res.status(201).json({result:true,statusCode:201, message: 'Product added to cart successfully', cartItem });
    } catch (error) {
        res.status(500).json({ result: false, statusCode: 500, message: 'Error adding product to cart', error });
    }
};
const getCartItems = async (req, res) => {
    try {
        const { ShopId } = req.params;

        // Find all items in the cart for this specific shop
        const cartItems = await Cart.find({ ShopId });

        if (!cartItems.length) {
            return res.status(404).json({ result: false, statusCode: 404, message: 'No items found in cart for this shop.' });
        }

        // Retrieve product details for each item in the cart
        const cartWithProductDetails = await Promise.all(
            cartItems.map(async (item) => {
                const productDetails = await Product.findById(item.ProductId).lean();

                // Remove the 'wishlist' property from productDetails
                if (productDetails && productDetails.wishlist) {
                    delete productDetails.wishlist;
                }

                return {
                    ...item.toObject(), // Convert item to plain object
                    productDetails, // Add product details without 'wishlist'
                };
            })
        );

        res.status(200).json({ result: true, statusCode: 200, message: 'Cart items retrieved successfully', cartItems: cartWithProductDetails });
    } catch (error) {
        res.status(500).json({ result: false, statusCode: 500, message: 'Error retrieving cart items', error });
    }
};
const deleteCartItem = async (req, res) => {
    try {
        const { ShopId, ProductId } = req.params;

        // Find and delete the cart item for the specific shop and product
        const deletedItem = await Cart.findOneAndDelete({ ShopId, ProductId });

        if (!deletedItem) {
            return res.status(404).json({ message: 'Cart item not found for this shop and product.' });
        }

        res.status(200).json({ result: true, statusCode: 200, message: `Cart item deleted successfully`,});
    } catch (error) {
        res.status(500).json({ result: true, statusCode: 500, message: 'Error deleting cart item', error });
    }
};
module.exports = { addToCart, getCartItems, deleteCartItem };
