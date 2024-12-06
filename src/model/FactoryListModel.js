// Import Mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define Product Schema
const factorySchema = new mongoose.Schema({
    factoryName: String,
    contactPerson: String,
    factoryId:String,
    contactNo: String,
    email: String,
    website: String,
    factoryAddress: String,
    city: String,
    state: String,
    FASSAINumber: String,
    GSTNumber:String,
    postalCode: String,
    country: String,
    isAllowLogin: { type: Boolean, default: false },
    products: [{
        category: String,
        brandName: String,
    }],
});

const Factory = mongoose.model('Factory', factorySchema);

module.exports = Factory;
