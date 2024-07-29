// Import Mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define Product Schema
const productSchema = new Schema({
    productName: { type: String, required: true },
    productDescription: { type: String, default: '' },
    category: { type: String, default: null },
    subCategory: { type: String, default: null },
    unit: { type: String, default: null },
    productCode: { type: String, default: null },
    price: { type: Number, default: null },
    discount: { type: String, default: '' },
    supplierName: { type: String, default: '' },
    FactoryId: { type: String, default: '' },
    supplierCity: { type: String, default: '' },
    Brand_Name: { type: String, default: '' }, 
    supplierContactNumber: { type: String, default: '' },
    CommissionPercentage: { type: String, default: '' },
    effectiveDate: { type: Date, default: null },
    expiryDate: { type: Date, default: null },
    qualityVariety: { type: String, default: '' },
    isVisible: { type: Boolean, default: '' },
    action: { type: String, default: '' },
    selectedImages: [{ type: String }]  // Assuming these are URLs or paths to images
});

// Create a model based on the schema
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
