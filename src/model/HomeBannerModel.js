const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    text: { type: String, required: true },
    image: { type: String, required: true }, // Store image path
    isActive: { type: Boolean, default: false }
});

module.exports = mongoose.model('Banner', bannerSchema);
