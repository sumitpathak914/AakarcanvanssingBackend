const mongoose = require('mongoose');

// Define product schema
const productSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    discount: {
        type: String,
        default: ""
    },
    selectedImages: {
        type: [String], // Array of strings (image paths)
        default: []
    },
    productName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    subCategory: {
        type: String,
        required: true
    },
    productCode: {
        type: String,
        required: true
    },
    Qty: {
        type: String,
        default: ""
    },
    Dis_Amt: {
        type: String,
        default: ""
    }
});

// Define schema
const quotationSchema = new mongoose.Schema({
    Action: Number,
    ShopInformation: {
        ShopName: String,
        ShopOwnerContactPerson: String,
        Contact: String,
        EmailID: String,
        BillingAddress: String,

    },
    AddDetails: {
        QuotationID: String,
        QuotationDate: Date,
        ExpiryDate: Date,
    },
    ProductDetails: {
        selectedProducts: [productSchema], // Array of products based on productSchema
        Subtotal: Number,
        Total: Number,
        Commission: Number,
        Tax: Number,
    },
});

// Create model
const Quotation = mongoose.model('Quotation', quotationSchema);

module.exports = Quotation;
