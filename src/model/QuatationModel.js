const mongoose = require('mongoose');
const SelectionSchema = new mongoose.Schema({
    size: { type: String, required: true },
    quantity: { type: Number, required: true }
});

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
    Total: {
        type: Number,
        default: ""
    },

    Dis_Amt: {
        type: Number,
        default: ""
    },
    selection: [SelectionSchema],
});



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
        TotalDiscount: Number,

    },
   
});

// Create model
const Quotation = mongoose.model('Quotation', quotationSchema);

module.exports = Quotation;
