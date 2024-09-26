const Dealer = require('../model/DealerModel');
const Order = require('../model/OrderManagmentandDispatchModel');
const jwt = require('jsonwebtoken');

const FactoryController = {

    SaveDealer: async (req, res) => {
        const { shopName, contactPerson, email, gstNumber, password, confirmPassword, FSSAINumber, contactNumber } = req.body;

        // Check for missing fields
        if (!shopName) {
            return res.status(400).json({ result: false, statusCode: 400, message: 'Shop name is required' });
        }
        if (!contactPerson) {
            return res.status(400).json({ result: false, statusCode: 400, message: 'Contact person is required' });
        }
        if (!email) {
            return res.status(400).json({ result: false, statusCode: 400, message: 'Email is required' });
        }
        if (!gstNumber) {
            return res.status(400).json({ result: false, statusCode: 400, message: 'GST number is required' });
        }
        if (!password) {
            return res.status(400).json({ result: false, statusCode: 400, message: 'Password is required' });
        }
        if (!confirmPassword) {
            return res.status(400).json({ result: false, statusCode: 400, message: 'Confirm password is required' });
        }
        if (!contactNumber) {
            return res.status(400).json({ result: false, statusCode: 400, message: 'Contact number is required' });
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ result: false, statusCode: 400, message: 'Passwords do not match' });
        }

        try {
            // Check if dealer already exists
            const existingDealer = await Dealer.findOne({ email });
            if (existingDealer) {
                return res.status(400).json({ result: false, statusCode: 400, message: 'Email is already in use' });
            }




            // Create a new dealer instance
            const dealer = new Dealer({
                shopName,
                contactPerson,
                email,
                gstNumber,
                password,
                confirmPassword, FSSAINumber,
                contactNumber
            });

            // Save new dealer
            await dealer.save();

            res.status(201).json({ result: true, statusCode: 201, message: 'Dealer registered successfully' });
        } catch (error) {
            console.error('Error saving dealer:', error); // Log the error
            res.status(500).json({ result: false, statusCode: 500, message: 'Internal Server Error' });
        }
    },

    LoginDealer: async (req, res) => {
        const { email, password } = req.body;

        // Check for missing fields
        if (!email) {
            return res.status(400).json({ result: false, statusCode: 400, message: 'Email is required' });
        }
        if (!password) {
            return res.status(400).json({ result: false, statusCode: 400, message: 'Password is required' });
        }

        try {
            // Check if dealer exists
            const dealer = await Dealer.findOne({ email });
            if (!dealer) {
                return res.status(400).json({ result: false, statusCode: 400, message: 'Dealer not found' });
            }
            if (password !== dealer.password) {
                return res.status(400).json({ result: false, statusCode: 400, message: 'Invalid password' });
            }

            if (!dealer.isAllowLogin) {
                return res.status(403).json({ result: false, statusCode: 403, message: 'Login not allowed. Please contact support.' });
            }
            // Validate password

            // Generate JWT token
            const token = jwt.sign({ id: dealer._id, email: dealer.email }, "AakaarCanvansing@#123", { expiresIn: '2 days' });

            const { password: _, confirmPassword: __, ...dealerInformation } = dealer._doc;

            res.status(200).json({
                result: true,
                statusCode: 200,
                message: 'Login successful',
                token,
                DealerInformation: dealerInformation
            });
        } catch (error) {
            console.error('Error logging in dealer:', error); // Log the error
            res.status(500).json({ result: false, statusCode: 500, message: 'Internal Server Error' });
        }
    },

    GetAllDealers: async (req, res) => {
        try {
            // Fetch all dealers from the database
            const dealers = await Dealer.find({});

            // If no dealers are found
            if (!dealers || dealers.length === 0) {
                return res.status(404).json({ result: false, statusCode: 404, message: 'No dealers found' });
            }

            // Return dealer information, excluding sensitive data like password
            // const dealerInformation = dealers.map(({ password, confirmPassword, ...dealerData }) => dealerData);

            res.status(200).json({
                result: true,
                statusCode: 200,
                message: 'Dealers retrieved successfully',
                data: dealers
            });
        } catch (error) {
            console.error('Error retrieving dealers:', error); // Log the error
            res.status(500).json({ result: false, statusCode: 500, message: 'Internal Server Error' });
        }
    },
    UpdateIsAllowLogin: async (req, res) => {
        const { shopId, isAllowLogin } = req.body;

        // Validate the shopId input
        if (!shopId) {
            return res.status(400).json({ result: false, statusCode: 400, message: 'Shop ID is required' });
        }

        try {
            // Find the dealer by shopId
            const dealer = await Dealer.findOne({ shopId });

            // Check if dealer exists
            if (!dealer) {
                return res.status(404).json({ result: false, statusCode: 404, message: 'Dealer not found' });
            }

            // Update isAllowLogin with the provided value
            dealer.isAllowLogin = isAllowLogin;
            await dealer.save();

            res.status(200).json({ result: true, statusCode: 200, message: `Login access ${isAllowLogin ? 'granted' : 'revoked'} successfully`, data: dealer });
        } catch (error) {
            console.error('Error updating isAllowLogin:', error); // Log the error
            res.status(500).json({ result: false, statusCode: 500, message: 'Internal Server Error' });
        }
    },

    calculateDealerCommission: async (req, res) => {
        try {
            const orders = await Order.find(); // Fetch all orders
            const commissions = {};

            // Loop through orders to calculate commissions
            for (const order of orders) {
                const shopId = order.ShopId; // Get ShopId from the order

                // Loop through the ProductDetails array
                for (const product of order.ProductDetails) {
                    // Check if the product's dispatch status is completed
                    if (product.dispatchShippingDetails.DispatchStatus === 'Completed') {
                        const factoryId = product.SupplierInfo.FactoryId; // Get the factory ID from SupplierInfo
                        const commissionRates = product.commission; // Get commission rates for different sizes

                        // Calculate commission based on the size and quantity
                        for (const selection of product.selection) {
                            const size = selection.size; // Get the size of the product
                            const quantity = selection.quantity; // Get the quantity of the product

                            let commissionRate;
                            if (size === '30kg') {
                                commissionRate = commissionRates.dealer30Kg; // Get the dealer commission for 30kg
                            } else if (size === '50kg') {
                                commissionRate = commissionRates.dealer50Kg; // Get the dealer commission for 50kg
                            } else if (size === '70kg') {
                                commissionRate = commissionRates.dealer70Kg; // Get the dealer commission for 70kg
                            }

                            if (commissionRate) {
                                // Calculate total commission for this product
                                const totalCommission = commissionRate * quantity;

                                // Initialize the commission for this shop or factory if it doesn't exist
                                if (!commissions[shopId]) {
                                    commissions[shopId] = 0;
                                }

                                // Add the total commission to the shop's or factory's total
                                commissions[shopId] += totalCommission;
                            }
                        }
                    }
                }
            }

            res.status(200).json({ result: true, statusCode: 200, commissions });
        } catch (error) {
            console.error('Error calculating commissions:', error);
            res.status(500).json({ result: false, statusCode: 500, error: 'Failed to calculate commissions.' });
        }
    },

    GetDealerByShopId: async (req, res) => {
        try {
            const { shopId } = req.params; // Extract shopId from the request parameters

            // Fetch the dealer from the database using shopId
            const dealer = await Dealer.findOne({ shopId });

            // If no dealer is found with the provided shopId
            if (!dealer) {
                return res.status(404).json({
                    result: false,
                    statusCode: 404,
                    message: `Dealer with shopId ${shopId} not found`
                });
            }

            // Return dealer information, excluding sensitive data like password
            const { password, confirmPassword, ...dealerData } = dealer._doc;

            res.status(200).json({
                result: true,
                statusCode: 200,
                message: 'Dealer retrieved successfully',
                data: dealerData
            });
        } catch (error) {
            console.error('Error retrieving dealer:', error); // Log the error
            res.status(500).json({ result: false, statusCode: 500, message: 'Internal Server Error' });
        }
    }



};
module.exports = FactoryController;