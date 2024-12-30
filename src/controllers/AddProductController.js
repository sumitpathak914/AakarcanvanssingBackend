// Import the Product model
const Product = require('../model/AddProductModel');
const UserReview = require('../model/ProductReviewModel');
// Controller methods
const productController = {
    // Create a new product
    createProduct: async (req, res) => {
        try {
            const {
                productName,
                productDescription,
                category,
                subCategory,
                unit,
                price,
                discount,
                effectiveDate,
                expiryDate,
                qualityVariety,
                supplierName,
                supplierContactNumber,
                supplierCity,
                FactoryGST,
                FactoryFSSAI,
                productCode,
                FactoryId,
                action,
                isVisible,
                Brand_Name,
                Commission,
                selectedImages = [] // Ensure selectedImages defaults to an array if undefined
            } = req.body;

            // Validation for required fields if action is 1
            if (action === 1) {
                if (!productName || !category || !subCategory || !unit || !price || !supplierName || !supplierContactNumber || !supplierCity || !Brand_Name) {
                    return res.status(400).json({
                        result: false,
                        statusCode: 404,
                        message: 'Please fill the Records'
                    });
                }
            }

            // Add default image if selectedImages is empty or undefined
            if (!selectedImages || selectedImages.length === 0) {
                selectedImages.push(
                   "data:image/jpeg;base64,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"
                );
            }

            // Create the product
            const newProduct = new Product({
                productName,
                productDescription,
                category,
                subCategory,
                supplierName,
                supplierContactNumber,
                supplierCity,
                FactoryGST,
                FactoryFSSAI,
                unit,
                price,
                discount,
                effectiveDate,
                FactoryId,
                expiryDate,
                qualityVariety,
                selectedImages,
                productCode,
                action,
                isVisible,
                Commission,
                Brand_Name
            });

            await newProduct.save();

            res.status(201).json({
                result: true,
                statusCode: 200,
                message: 'Product created successfully',
                productList: newProduct
            });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },

    // Get all products
    getAllProducts: async (req, res) => {
        try {
            const productsList = await Product.find();
            res.status(200).json({ result: true, statusCode: 200, productsList });
        } catch (err) {
            res.status(500).json({ result: false, statusCode: 500, message: err.message });
        }
    },

    getAllProductsForEcommerceNew: async (req, res) => {
        try {
            // Fetch the products that are visible
            // const productsList = await Product.find({ isVisible: true });
             const productsList = await Product.find({ isVisible: true }).select('-wishlist');

            // Use Promise.all to fetch review counts and average ratings for all products
            const productsWithReviews = await Promise.all(productsList.map(async (product) => {
                // Fetch reviews for the current product
                const reviews = await UserReview.find({ productId: product._id });

                // Calculate review count
                const reviewCount = reviews.length;

                // Calculate average star rating
                const averageRating = reviewCount > 0
                    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount) // Average as a number
                    : 0; // Default to 0 if no reviews

                // Return a new product object with the review count and average rating
                return {
                    ...product.toObject(), // Convert Mongoose document to plain object
                    reviewCount,           // Add the review count
                    averageRating,         // Add the average rating as a number
                };
            }));

            res.status(200).json({
                result: true,
                statusCode: 200,
                productsList: productsWithReviews,
            });
        } catch (err) {
            res.status(500).json({ result: false, statusCode: 500, message: err.message });
        }
    },

    getAllProductsForEcommerce: async (req, res) => {
        try {
            const { shopId } = req.query; // Get the shopId from the query parameters

            // Fetch the products that are visible
            const productsList = await Product.find({ isVisible: true });

            // Use Promise.all to fetch review counts, average ratings, and wishlist status for all products
            const productsWithReviews = await Promise.all(productsList.map(async (product) => {
                // Fetch reviews for the current product
                const reviews = await UserReview.find({ productId: product._id });

                // Calculate review count
                const reviewCount = reviews.length;

                // Calculate average star rating
                const averageRating = reviewCount > 0
                    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount) // Average as a number
                    : 0; // Default to 0 if no reviews

                // Check if the shopId is in the product's wishlist array
                const isWishlisted = Array.isArray(product.wishlist) && product.wishlist.includes(shopId);

                // Return a new product object with the review count, average rating, and wishlist status
                return {
                    ...product.toObject(), // Convert Mongoose document to plain object
                    reviewCount,           // Add the review count
                    averageRating,         // Add the average rating as a number
                    wishlist: isWishlisted // Add wishlist status based on shopId
                };
            }));

            res.status(200).json({
                result: true,
                statusCode: 200,
                productsList: productsWithReviews,
            });
        } catch (err) {
            res.status(500).json({ result: false, statusCode: 500, message: err.message });
            console.log(err)
        }
    },


    // Get a single product by ID
    getProductById: async (req, res) => {
        try {
            const productId = req.body.productId;
            const product = await Product.findById(productId);

            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            res.json({ result: true, statusCode: 200, SingleProductList: product });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getProductsByIdsForViewOrders: async (req, res) => {
        try {
            const productIds = req.body.productIds; // Expecting an array of IDs
            if (!Array.isArray(productIds) || productIds.length === 0) {
                return res.status(400).json({ message: 'Invalid product IDs' });
            }

            const products = await Product.find({ _id: { $in: productIds } });

            if (!products || products.length === 0) {
                return res.status(404).json({ message: 'Products not found' });
            }

            res.json({ result: true, statusCode: 200, products: products });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getProductByIdForEcommerce: async (req, res) => {
        try {
            const productId = req.body.productId;
            // const product = await Product.findById(productId);
            const product = await Product.findById(productId).select('-wishlist');
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            res.json({ result: true, statusCode: 200, SingleProductList: product });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateProductById: async (req, res) => {
        const productId = req.params.id;
        const productData = req.body;

        try {
            // Handle image uploads
            if (req.files) {
                const imagePaths = req.files.map(file => file.path);
                productData.selectedImages = imagePaths;
            }

            const updatedProduct = await Product.findByIdAndUpdate(productId, productData, { new: true });

            if (!updatedProduct) {
                return res.status(404).json({ message: 'Product not found' });
            }

            res.status(200).json({ statusCode: 200, message: 'Product updated successfully', updatedProduct });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    },


    deleteProductById: async (req, res) => {
        try {
            const deletedProduct = await Product.findByIdAndDelete(req.params.id);
            if (!deletedProduct) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.status(200).json({ message: 'Product deleted successfully' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },


    updateVisibility: async (req, res) => {
        const { productCode, isVisible } = req.body;

        try {
            const product = await Product.findOne({ productCode });

            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            product.isVisible = isVisible;
            await product.save();

            res.status(200).json({ result: true, statusCode: 200, message: 'Product visibility updated successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    },


    updatePrice: async (req, res) => {
        try {
            const { productId, price } = req.body;

            // Validate productId and price
            if (!productId) {
                return res.status(400).json({ result: false, statusCode: 404, message: 'Product ID  are required' });
            }

            // Find the product by ID and update its price
            const product = await Product.findByIdAndUpdate(
                productId,
                { price: price },
                { new: true } // This option returns the updated document
            );

            if (!product) {
                return res.status(404).json({ result: false, statusCode: 404, message: 'Product not found' });
            }

            res.status(200).json({ result: true, statusCode: 200, message: 'Price updated successfully' });
        } catch (error) {
            console.error('Error updating product price:', error);
            res.status(500).json({ message: 'Server error', error });
        }
    },

    getProductsByFactoryId: async (req, res) => {
        const { factoryId } = req.params;

        try {
            // Find products with the given factoryId
            const products = await Product.find({ FactoryId: factoryId });

            // Check if products exist
            if (!products.length) {
                return res.status(404).json({
                    result: false,
                    statusCode: 404,
                    message: 'No products found for this factory'
                });
            }

            // Send response with found products
            res.status(200).json({
                result: true,
                statusCode: 200,
                productsList: products
            });
        } catch (err) {
            // Handle any errors that occur during the process
            res.status(500).json({
                result: false,
                statusCode: 500,
                message: err.message
            });
        }
    },


    addToFavorite: async (req, res) => {
        const { productId, shopId } = req.body;  // Destructure both productId and shopId from request body
        console.log('Product ID:', productId, 'Shop ID:', shopId);  // Log both IDs for debugging

        try {

            if (!productId || !shopId) {
                return res.status(400).json({ message: 'Product ID and Shop ID are required' });
            }


            const product = await Product.findById(productId);


            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }


            if (!product.wishlist.includes(shopId)) {
                product.wishlist.push(shopId);
                await product.save();
            } else {
                return res.status(409).json({ message: 'Shop is already in favorites' });
            }


            res.status(200).json({ message: 'Product added to favorites', product });
        } catch (error) {
            console.error('Error adding to favorites:', error);  // Log the error for debugging
            res.status(500).json({ error: 'An error occurred while adding to favorites' });
        }
    },
    removeFromFavorites: async (req, res) => {
        const { productId, shopId } = req.body;  // Destructure productId and shopId from request body
        console.log('Product ID:', productId, 'Shop ID:', shopId);  // Log both IDs for debugging

        try {
            // Check if productId and shopId are provided
            if (!productId || !shopId) {
                return res.status(400).json({ message: 'Product ID and Shop ID are required' });
            }

            // Find the product by productId
            const product = await Product.findById(productId);

            // Check if the product exists
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            // Check if shopId is in the wishlist
            const index = product.wishlist.indexOf(shopId);
            if (index !== -1) {
                // If found, remove shopId from the wishlist
                product.wishlist.splice(index, 1);
                await product.save();
                res.status(200).json({ message: 'Shop removed from favorites', product });
            } else {
                return res.status(409).json({ message: 'Shop is not in favorites' });
            }
        } catch (error) {
            console.error('Error removing from favorites:', error);  // Log the error for debugging
            res.status(500).json({ error: 'An error occurred while removing from favorites' });
        }
    },
    getWishlistProducts: async (req, res) => {
        const { shopId } = req.params;  // Extract shopId from route parameters
        // Log the shop ID for debugging

        try {
            // Validate the shopId
            if (!shopId) {
                return res.status(400).json({ message: 'Shop ID is required' });
            }

            // Find products that include the shopId in their wishlist
            const products = await Product.find({ wishlist: shopId }).select('-wishlist'); // Exclude wishlist

            // Check if any products were found
            if (products.length === 0) {
                return res.status(404).json({ statusCode: 404, result: false, wishlistProduct:[], message: 'No products found in wishlist for this shop' });
            }
            // Return the found products
            res.status(200).json({ statusCode: 200, result: true, wishlistProduct: products });
        } catch (error) {
            console.error('Error retrieving wishlist products:', error);  // Log the error for debugging
            res.status(500).json({ statusCode: 500, result: false, error: 'An error occurred while retrieving wishlist products' });
        }
    },




};

module.exports = productController;
