const Dealer = require('../model/DealerModel');

const jwt = require('jsonwebtoken');

const FactoryController = {

     SaveDealer : async (req, res) => {
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
                confirmPassword,                FSSAINumber,
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

            if (!dealer.isAllowLogin) {
                return res.status(403).json({ result: false, statusCode: 403, message: 'Login not allowed. Please contact support.' });
            }
            // Validate password
            if (password !== dealer.password) {
                return res.status(400).json({ result: false, statusCode: 400, message: 'Invalid password' });
            }

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






};
module.exports = FactoryController;