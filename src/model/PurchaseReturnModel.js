const mongoose = require('mongoose');



const SelectionSchema = new mongoose.Schema({
    size: { type: String, required: true },
    quantity: { type: Number, required: true }
});
const productDetailsSchema = new mongoose.Schema({
    ProductID: {
        type: String,
        required: true
    },
    ProductName: {
        type: String,
        required: true
    },
    MRP: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    returnStatus: {
        type: String,

        default: "Pending"
    },
    RejectedMessage: {
        type: String,

    },

    selectedImages: {
        type: [String], // Array of strings (image paths)
        default: []
    },
    selection: [SelectionSchema],
});

const supplierInfoSchema = new mongoose.Schema({
    FactoryName: {
        type: String,
        required: true
    },
    FactoryAddress: {
        type: String,
        required: true
    },
    FactoryContact: {
        type: String,
        required: true
    },
    FactoryId: {
        type: String,
        required: true
    }
});

const customerInfoSchema = new mongoose.Schema({
    CustomerName: {
        type: String,
        required: true
    },
    ShopName: {
        type: String,
        required: true
    },
    ContactNo: {
        type: String,
        required: true
    },
    EmailID: {
        type: String,
        required: true
    },
    Billing_Address: {
        type: String,
        required: true
    },
    Shipping_Address: {
        type: String,
        required: true
    }
});

const purchaseReturnSchema = new mongoose.Schema({
    OrderId: {
        type: String,
        required: true
    },
    OrderDate: {
        type: String,
        required: true
    },
    totalAmount: {
        type: String,
        required: true
    },
    DuePayment: {
        type: String,
        required: true
    },
    returnMessage: {
        type: String,
        required: true
    },
    productDetails:[productDetailsSchema],
    SupplierInfo: supplierInfoSchema,
    customerInfo: customerInfoSchema,

}, { timestamps: true });

const PurchaseReturn = mongoose.model('PurchaseReturn', purchaseReturnSchema);

module.exports = PurchaseReturn;
