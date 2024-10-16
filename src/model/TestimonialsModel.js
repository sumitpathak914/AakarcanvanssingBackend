// models/testimonialModel.js
const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
    review: {
        type: String,
        required: true,
    },
    shopName: {
        type: String,
        required: true,
    },
    personName: {
        type: String,
        required: true,
    },
}, {
    timestamps: true, // Automatically add createdAt and updatedAt fields
});

const Testimonial = mongoose.model('Testimonial', testimonialSchema);
module.exports = Testimonial;
