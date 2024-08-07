// models/UserReview.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserReviewSchema = new Schema({
    rating: { type: Number, required: true },
    review: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserReview', UserReviewSchema);
