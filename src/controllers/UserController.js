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

            // Send all users with the role "Factory" in the response
            res.json({ result: true, statusCode: 200, FactoryList: users });
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Error");
        }
    },

    getFactoryById: async (req, res) => {
        const { factoryId } = req.params;

        try {
            // Find the user by factoryId
            const user = await User.findOne({ factoryId });

            // Check if the user exists and has the role "Factory"
            if (!user || user.role !== "Factory") {
                return res.status(404).json({ result: false, statusCode: 404, message: "Factory not found" });
            }

            res.json({ result: true, statusCode: 200, Factory: user });
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Error");
        }
    },

    deleteFactory: async (req, res) => {
        const { id } = req.params;

        console.log(id)

        try {
            const deletedFactory = await User.findByIdAndDelete(id);

            if (!deletedFactory) {
                console.log(`Factory not found for ID: ${id}`);
                return res.status(404).json({ result: false, statusCode: 404, message: 'Factory not found.' });
            }

            res.status(200).json({ result: true, statusCode: 200, message: 'Factory deleted successfully.' });
        } catch (error) {
            console.error('Error deleting factory:', error);
            res.status(500).json({ result: false, statusCode: 500, error: 'Failed to delete factory.' });
        }
    },
};

module.exports = userController;
