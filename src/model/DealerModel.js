// models/Dealer.js
const mongoose = require('mongoose');

const dealerSchema = new mongoose.Schema({
    shopName: { type: String, required: true },
    contactPerson: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    gstNumber: { type: String, required: true },
    password: { type: String, required: true },
    confirmPassword: { type: String, required: true },
});

const Dealer = mongoose.model('Dealer', dealerSchema);
module.exports = Dealer;
