const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FactoryUserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        required: true,
        enum: ['Admin', 'Factory'],
        default: 'Factory'
    },
    factoryId: { type: String, unique: true },
    CommissionDoneAmount: { type: String, },
    factoryName: { type: String, },
    contactPerson: { type: String, },
    contactNo: { type: String, },
    email: { type: String, unique: true },
    website: { type: String },
    factoryAddress: { type: String, },
    city: { type: String, },
    postalCode: { type: String, },
    country: { type: String, },
    State: { type: String, },
    FASSAINumber: { type: String },
    GSTNumber: { type: String },
    isAllowLogin: { type: Boolean, default: false },
});

const FactoryUserCatelfild = mongoose.model('CatelfiedFactoryList', FactoryUserSchema);

module.exports = FactoryUserCatelfild;
