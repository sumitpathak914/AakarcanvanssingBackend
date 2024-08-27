const mongoose = require('mongoose');

const commissionSlabSchema = new mongoose.Schema({
    category: { type: String, required: true },
    subcategory: { type: String, required: true },
    commissions: {
        dealer30Kg: { type: Number, required: true },
        supplier30Kg: { type: Number, required: true },
        dealer50Kg: { type: Number, required: true },
        supplier50Kg: { type: Number, required: true },
        dealer70Kg: { type: Number, required: true },
        supplier70Kg: { type: Number, required: true },
    },
    isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model('CommissionSlab', commissionSlabSchema);
