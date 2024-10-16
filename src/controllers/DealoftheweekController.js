// controllers/dealWeekController.js
const Product = require('../model/AddProductModel'); // Ensure the path is correct
const DealWeek = require('../model/DealOfTheWeekModel'); // Ensure the path is correct

const dealWeekController = {
    addDealOfTheWeekProducts: async (req, res) => {
        try {
            const { productIds } = req.body;

            // Validate the product IDs
            if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
                return res.status(400).json({ message: 'Product IDs are required.' });
            }

            // Remove any previous entries in the Deal of the Week
            await DealWeek.deleteMany({});

            const deals = [];

            for (const id of productIds) {
                // Find the product and check if its DealWeek is false
                const product = await Product.findById(id);
                if (product && product.DealWeek === false) { // Check if DealWeek is false
                    deals.push({
                        productId: product._id,
                        productName: product.productName,
                        price: product.price,
                        effectiveDate: new Date(), // Set this to your logic
                        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Example: 7 days from now
                    });

                    // Update the product's DealWeek field to true
                    await Product.findByIdAndUpdate(id, { DealWeek: true });
                }
            }

            // Save all new deals to the database only if there are any new deals
            if (deals.length > 0) {
                await DealWeek.insertMany(deals);
                res.status(201).json({ message: 'Deal of the Week products added successfully.', deals });
            } else {
                res.status(200).json({ message: 'No new products to add to Deal of the Week.' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

    removeDealOfTheWeekProduct: async (req, res) => {
        try {
            const { id } = req.params;

            // Validate the product ID
            if (!id) {
                return res.status(400).json({ message: 'Product ID is required.' });
            }

            // Remove the product from Deal of the Week
            await DealWeek.deleteOne({ productId: id });

            // Update the product's DealWeek field to false
            await Product.findByIdAndUpdate(id, { DealWeek: false });

            res.status(200).json({ message: 'Product removed from Deal of the Week successfully.' });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },
    getDealOfTheWeek: async (req, res) => {
        try {
            // Find all products where DealWeek is true
            const deals = await Product.find({ DealWeek: true })
                .select('productName productDescription category subCategory unit productCode price discount supplierName FactoryId supplierCity Brand_Name supplierContactNumber effectiveDate expiryDate qualityVariety isVisible action selectedImages Commission');

            if (!deals || deals.length === 0) {
                return res.status(404).json({ message: 'No deals found.' });
            }

            // Send the deals to the frontend
            res.status(200).json({ deals });
        } catch (error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    },

};


module.exports = dealWeekController;
