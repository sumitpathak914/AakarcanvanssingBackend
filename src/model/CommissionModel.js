const mongoose = require('mongoose');

const commissionSlabSchema = new mongoose.Schema({
    category: { type: String, required: true },
    subcategory: { type: String, required: true },
    commissionPerKg: { type: Number, required: true },
    isActive: { type: Boolean, default: true }, // Default is true
});

module.exports = mongoose.model('CommissionSlab', commissionSlabSchema);
