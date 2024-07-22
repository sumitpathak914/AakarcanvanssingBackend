// Import the Product model
const Product = require('../model/AddProductModel'); // Adjust the path as per your project structure

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
                selectedImages // base64 images
            } = req.body;

            if (action === 1) {
                if (!productName || !productDescription || !category || !subCategory || !unit || !price || !qualityVariety || !supplierName || !supplierContactNumber || !supplierCity || !Brand_Name) {
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
                Brand_Name
            });

            await newProduct.save();
            res.status(201).json({ result: true, statusCode: 200, message: 'Product created successfully', product: newProduct });
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

    // Delete a product by ID
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
};

module.exports = productController;
