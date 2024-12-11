const mongoose = require('mongoose');

// Define the schema for the price status
const priceSchema = new mongoose.Schema({
    showPrice: {
        type: Boolean,
        required: true,
        default: false, // Default value, can be adjusted as needed
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
});

// Create a model using the schema
const PriceModel = mongoose.model('Price', priceSchema);

module.exports = PriceModel;
