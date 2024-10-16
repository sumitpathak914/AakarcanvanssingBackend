const Count = require('../model/CountModel');

// Create or Update counts
exports.createOrUpdateCounts = async (req, res) => {
    try {
        const { totalProducts, teamMembers, satisfiedCustomers, awardsWon } = req.body;

        const count = await Count.findOneAndUpdate(
            {}, // This finds the first document (you may want to update a specific one)
            { totalProducts, teamMembers, satisfiedCustomers, awardsWon },
            { new: true, upsert: true } // Creates a new document if none exists
        );

        res.status(200).json(count);
    } catch (error) {
        res.status(500).json({ message: 'Error updating counts', error });
    }
};

// Get counts
exports.getCounts = async (req, res) => {
    try {
        const counts = await Count.findOne({});
        res.status(200).json(counts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching counts', error });
    }
};
