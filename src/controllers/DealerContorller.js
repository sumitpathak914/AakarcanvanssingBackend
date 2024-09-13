const Dealer = require('../model/DealerModel');

const jwt = require('jsonwebtoken');

const FactoryController = {

    SaveDealer: async (req, res) => {
        const { shopName, contactPerson, email, gstNumber, password, confirmPassword, FSSAINumber
} = req.body;

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

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ result: false, statusCode: 400, message: 'Passwords do not match' });
        }

        try {
            // Check if dealer already exists
            const existingDealer = await Dealer.findOne({ email });
            if (existingDealer) {
                return res.status(400).json({ result: false, statusCode: 400, message: 'Dealer already exists' });
            }

            // Save new dealer
            const dealer = new Dealer({ shopName, contactPerson, email, gstNumber, password, confirmPassword, FSSAINumber });
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

    // GET all factories





};
module.exports = FactoryController;