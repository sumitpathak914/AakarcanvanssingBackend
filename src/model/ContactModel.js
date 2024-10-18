const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactDetailsSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.']
    },
    phone: {
        type: String,
        required: true,
        match: [/^\d{10,15}$/, 'Please provide a valid phone number.']
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const contactSchema = new Schema({
    contactInfo: [contactDetailsSchema], // Array of contact details
    count: {
        type: String,
        default: "0"
    },
});

module.exports = mongoose.model('Contact', contactSchema);
