const PriceModel = require('../../src/model/PriceShowModel'); // Import the relevant model for your data

// Controller function to toggle the price status
exports.togglePriceStatus = async (req, res) => {
    const { newState } = req.body;

    if (typeof newState !== 'boolean') {
        return res.status(400).json({
            success: false,
            message: 'Invalid request: newState must be provided and must be a boolean'
        });
    }

    try {
        // Update all documents with the new state and return the updated state
        const updatedPriceStatus = await PriceModel.updateMany(
            {},
            { $set: { showPrice: newState } }
        );

        if (updatedPriceStatus.modifiedCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'No price status records were updated'
            });
        }

        // Return the updated state to the client
        res.status(200).json({
            success: true,
            message: 'Price status updated successfully',
            showPrice: newState // Return the new state
        });
    } catch (error) {
        console.error('Error updating price status:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


exports.getPriceStatus = async (req, res) => {
    try {
        // Find the price status document
        const priceStatus = await PriceModel.findOne({});

        if (!priceStatus) {
            // Create and save an initial document if not found
            const newPriceStatus = new PriceModel({ showPrice: false }); // or true, based on your requirement
            await newPriceStatus.save();

            return res.status(200).json({
                success: true,
                message: 'Price status document created',
                showPrice: false, // Initial value
            });
        }

        res.status(200).json({
            success: true,
            showPrice: priceStatus.showPrice,
        });
    } catch (error) {
        console.error('Error fetching price status:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

