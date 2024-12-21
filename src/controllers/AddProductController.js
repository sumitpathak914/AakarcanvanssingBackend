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
                   " data:image/jpeg;base64,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"
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
