const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../model/userModel');

const loginController = {};

loginController.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ result: false, statuscode: 404, message: "Invalid credentials" });
        }

        // Compare the provided password with the stored hashed password
        // const isMatch = await bcrypt.compare(password, user.password);

        if (user.password !== password) {
            return res.status(404).json({ result: false, statuscode: 404, message: "Invalid credentials" });
        }

        const payload = {
            user: {
                id: user.id,
                email: user.email
            }
        };

        jwt.sign(
            payload,
            "AakaarCanvansing@#123",
            { expiresIn: " 8 days" },
            (err, token) => {
                if (err) throw err;
                if (user.role === "Factory") {
                    res.json({
                        result: true,
                        statuscode: 200,
                        token,
                        personalInfo: {
                            email: user.email,
                            role: user.role,
                            factoryId: user.factoryId,
                            factoryName: user.factoryName,
                            website: user.website,
                            factoryAddress: user.factoryAddress,
                            city: user.city,
                            postalCode: user.postalCode,
                            country: user.country,
                            State: user.State,
                            FASSAINumber: user.FASSAINumber,
                            GSTNumber: user.GSTNumber,

                            contactNo: user.
                                contactNo,
                            contactPerson: user.contactPerson,
                            
                        }
                    });
                } else {
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
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

module.exports = loginController;
