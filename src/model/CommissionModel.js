const mongoose = require('mongoose');

const commissionSlabSchema = new mongoose.Schema({
    category: { type: String, required: true },
    subcategory: { type: String, required: true },
    commissions: {
        dealer30Kg: { type: Number },
        supplier30Kg: { type: Number },
        dealer50Kg: { type: Number },
        supplier50Kg: { type: Number },
        dealer70Kg: { type: Number },
        supplier70Kg: { type: Number },
    },
    isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model('CommissionSlab', commissionSlabSchema);
