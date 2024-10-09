const factory = require('../model/FactoryListModel');
const Order = require('../model/OrderManagmentandDispatchModel');


const FactoryController = {

    SaveFactory: async (req, res) => {
        const factoryData = req.body;

        try {
            // Create a new Factory document
            const newFactory = new factory({
                factoryName: factoryData.factoryName,
                contactPerson: factoryData.contactPerson,
                contactNo: factoryData.contactNo,
                email: factoryData.email,
                website: factoryData.website,
                factoryAddress: factoryData.factoryAddress,
                city: factoryData.city,
                postalCode: factoryData.postalCode,
                country: factoryData.country,
                State: factoryData.State,
                FASSAINumber: factoryData.FASSAINumber,
                GSTNumber: factoryData.GSTNumber,
                products: factoryData.products,
                factoryId: factoryData.factoryId
            });

            // Save the new factory document to the database
            await newFactory.save();

            res.status(201).json({ result: true, statusCode: 201, message: 'Factory data saved successfully.' });
        } catch (error) {
            console.error('Error saving factory data:', error);
            res.status(500).json({ result: false, statusCode: 500, error: 'Failed to save factory data.' });
        }
    },

    
    // GET all factories
    getAllFactories: async (req, res) => {
        try {
            const factories = await factory.find();
            res.status(200).json({ result: true, statusCode: 201, factoriesList: factories, message: 'Factory data Get successfully.' });
        } catch (error) {
            console.error('Error fetching factories:', error);
            res.status(500).json({ result: false, statusCode: 500, error: 'Failed to fetch factories.' });
        }
    },

    // GET single factory by ID
    getFactoryById: async (req, res) => {
        const { id } = req.params;
        try {
            const factory = await factory.findById(id);
            if (!factory) {
                return res.status(404).json({ error: 'Factory not found.' });
            }
            res.status(200).json(factory);
        } catch (error) {
            console.error('Error fetching factory by ID:', error);
            res.status(500).json({ error: 'Failed to fetch factory.' });
        }
    },
    calculateFactoryCommission: async (req, res) => {
        try {
            const orders = await Order.find(); // Fetch all orders
            const commissions = {};

            // Loop through orders to calculate commissions
            for (const order of orders) {
                // Loop through the ProductDetails array
                for (const product of order.ProductDetails) {
                    // Check if the product's dispatch status is completed
                    if (product.dispatchShippingDetails.DispatchStatus === 'Completed') {
                        const factoryId = product.SupplierInfo.FactoryId; // Get the factory ID from the product
                        const commissionRates = product.commission; // Get commission rates for different sizes

                        // Calculate commission based on the size and quantity
                        for (const selection of product.selection) {
                            const size = selection.size; // Get the size of the product
                            const quantity = selection.quantity; // Get the quantity of the product

                            let commissionRate;
                            if (size === '30kg') {
                                commissionRate = commissionRates.supplier30Kg; // Get the supplier commission for 30kg
                            } else if (size === '50kg') {
                                commissionRate = commissionRates.supplier50Kg; // Get the supplier commission for 50kg
                            } else if (size === '70kg') {
                                commissionRate = commissionRates.supplier70Kg; // Get the supplier commission for 70kg
                            }

                            if (commissionRate) {
                                // Calculate total commission for this product
                                const totalCommission = commissionRate * quantity;

                                // Initialize the commission for this factory if it doesn't exist
                                if (!commissions[factoryId]) {
                                    commissions[factoryId] = 0;
                                }

                                // Add the total commission to the factory's total
                                commissions[factoryId] += totalCommission;
                            }
                        }
                    }
                }
            }

            res.status(200).json({ result: true, statusCode: 200, commissions });
        } catch (error) {
            console.error('Error calculating factory commissions:', error);
            res.status(500).json({ result: false, statusCode: 500, error: 'Failed to calculate commissions.' });
        }
    }



};
module.exports = FactoryController;