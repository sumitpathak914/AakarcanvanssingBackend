const User = require('../model/userModel');

const userController = {
    getFactoriesByCategory: async (req, res) => {
        const { category, subCategory } = req.body;

        try {
            // Find users with the role "Factory"
            const users = await User.find({ role: "Factory" });

            // Filter users based on category and subCategory in their products array
            const filteredUsers = users.filter(user =>
                Array.isArray(user.products) &&
                user.products.some(product =>
                    product.category === category && product.subCategory === subCategory
                )
            );

            res.json({ result: true, statusCode: 200, FactoryList: filteredUsers });
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Error");
        }
    },

    getAllUsers: async (req, res) => {
        try {
            // Find users with the role "Factory"
            const users = await User.find({ role: "Factory" });

            // Filter out users that do not have a products array or have an empty products array
            const filteredUsers = users.filter(user => Array.isArray(user.products) && user.products.length > 0);

            res.json({ result: true, statusCode: 200, FactoryList: filteredUsers });
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Error");
        }
    },
    getFactoryById: async (req, res) => {
        const { id } = req.params;

        try {
            // Find the user with the specified id
            const user = await User.findById(id);

            // Check if the user exists and has the role "Factory"
            if (!user || user.role !== "Factory") {
                return res.status(404).json({ result: false, statusCode: 404, message: "Factory not found" });
            }

            res.json({ result: true, statusCode: 200, Factory: user });
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Error");
        }
    }
};

module.exports = userController;
