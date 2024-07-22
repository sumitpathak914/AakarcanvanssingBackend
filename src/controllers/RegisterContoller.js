const User = require('../model/userModel');
const jwt = require('jsonwebtoken');

const registerController = {};

registerController.registerUser = async (req, res) => {
    const {
        email,
        password,
        factoryName,
        contactPerson,
        contactNo,
        website,
        factoryAddress,
        city,
        postalCode,
        country,
        State, // Corrected to lowercase
        FASSAINumber,
        GSTNumber,
        products,
        factoryId,
        role
    } = req.body;

    console.log("Received registration data:", req.body);
    if (!email || !password || !factoryName || !contactPerson || !contactNo || !factoryAddress || !city || !postalCode || !country || !State || !FASSAINumber || !GSTNumber  || !factoryId) {
        return res.status(400).json({ result: false, statuscode: 400, message: 'Missing required fields' });
    }
    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ result: false, statuscode: 400, message: 'User already exists' });
        }

        // Create new user
        user = new User({
            email,
            password,
            role,
            factoryId,
            factoryName,
            contactPerson,
            contactNo,
            website,
            factoryAddress,
            city,
            postalCode,
            country,
            State,
            FASSAINumber,
            GSTNumber,
            products
        });

        // Hash password before saving
        // user.password = await bcrypt.hash(password, 10);

        // Save user to database
        await user.save();

        // Generate JWT token
        const payload = {
            user: {
                id: user.id,
                email: user.email
            }
        };

        jwt.sign(
            payload,
            "AakaarCanvansing@#123",
            { expiresIn: "2 days" },
            (err, token) => {
                if (err) {
                    console.error('JWT Sign Error:', err);
                    return res.status(500).json({ result: false, statuscode: 500, message: 'Token generation failed' });
                }
                res.json({
                    result: true,
                    statuscode: 200,
                    token,
                    personalInfo: {
                        email: user.email,
                        role: user.role
                    }
                });
            }
        );

    } catch (err) {
        console.error('Server Error:', err.message);
        res.status(500).send({ result: false, statuscode: 500, message: 'Server Error' });
    }
};

module.exports = registerController;
