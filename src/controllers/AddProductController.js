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
                selectedImages // base64 images
            } = req.body;

            if (action === 1) {
                if (!productName || !productDescription || !category || !subCategory || !unit || !price || !supplierName || !supplierContactNumber || !supplierCity || !Brand_Name) {
                    return res.status(400).json({ result: false, statusCode: 404, message: 'Please fill the Records' });
                }
            }

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
            res.status(201).json({ result: true, statusCode: 200, message: 'Product created successfully', productList: newProduct });
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
