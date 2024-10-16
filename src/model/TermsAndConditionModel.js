// models/Terms.js
const mongoose = require('mongoose');

const termSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const Term = mongoose.model('Term', termSchema);

module.exports = Term;
