// models/DealWeekModel.js
const mongoose = require('mongoose');

const dealWeekSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    productName: { type: String, required: true },
    price: { type: Number, required: true },
    effectiveDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    isVisible: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
});

const DealWeek = mongoose.model('DealWeek', dealWeekSchema);

module.exports = DealWeek;
