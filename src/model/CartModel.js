const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    ProductId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Assuming there's a Product collection
        required: true
    },
    BagSizeAndQty: [
        {
            size: {
                type: String,
                required: true
            },
            QTY: {
                type: Number,
                required: true,
                min: 1
            }
        }
    ],
    ShopId: {type: String,},
    TotalPrice: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Cart', cartSchema);
