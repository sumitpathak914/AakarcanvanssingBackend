// Import Mongoose
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commissionSchema = new Schema({
    dealer30Kg: { type: Number, default: 0 },
    supplier30Kg: { type: Number, default: 0 },
    dealer50Kg: { type: Number, default: 0 },
    supplier50Kg: { type: Number, default: 0 },
    dealer70Kg: { type: Number, default: 0 },
    supplier70Kg: { type: Number, default: 0 },
    dealer100Kg: { type: Number, default: 0 },
    supplier100Kg: { type: Number, default: 0 }
});

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
    effectiveDate: { type: Date, default: null },
    expiryDate: { type: Date, default: null },
    qualityVariety: { type: String, default: '' },
    isVisible: { type: Boolean, default: false },
    action: { type: String, default: '' },
    selectedImages: [{ type: String }],  // Assuming these are URLs or paths to images
    Commission: commissionSchema,
    DealWeek: { type: Boolean, default: false },
    wishlist: [{ type: String }],
});

// Create a model based on the schema
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
