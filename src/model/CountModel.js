const mongoose = require('mongoose');

const countSchema = new mongoose.Schema({
    totalProducts: { type: Number, required: true, default: 0 },
    teamMembers: { type: Number, required: true, default: 0 },
    satisfiedCustomers: { type: Number, required: true, default: 0 },
    awardsWon: { type: Number, required: true, default: 0 },
});

module.exports = mongoose.model('Count', countSchema);
