// const mongoose = require('mongoose');
// const { v4: uuidv4 } = require('uuid'); // Import uuid

// const Schema = mongoose.Schema;

// const SelectionSchema = new Schema({
//     size: { type: String, required: true },
//     quantity: { type: Number, required: true }
// });

// const DispatchShippingDetailsSchema = new Schema({
//     DispatchID: { type: String },
//     EstimatedDeliveryDate: { type: Date },
//     DriverName: { type: String },
//     ContactNumber: { type: String },
//     VehicleNumber: { type: String },
//     TaxAndDuties: { type: String },
//     Insurance: { type: String },
//     RefundStatus: { type: String },
//     RefundReasons: { type: String },
//     RejectRefundReasons: { type: String },
//     RefundDate: { type: String },
//     OrderStatus: { type: String },
//     weight: { type: String },
//     Category: { type: String },
//     DispatchStatus: { type: String },
//     OrderCancelReason: { type: String },
//     OrderPendingReason: { type: String },
// });

// const SupplierInfoSchema = new Schema({
//     FactoryName: { type: String },
//     FactoryAddress: { type: String },
//     FactoryContact: { type: String },
//     FactoryId: { type: String },
// });

// const ProductDetailsSchema = new Schema({
//     ProductID: { type: String },
//     OrderDate: { type: String },
//     ProductName: { type: String },
//     MRP: { type: String },
//     QTY: { type: String },
//     discount: { type: String },
//     selection: [SelectionSchema],
//     dispatchShippingDetails: { type: DispatchShippingDetailsSchema },
//     SupplierInfo: { type: SupplierInfoSchema },
// });

// const TransactionRecordsData = new Schema({
//     TransactionID: { type: String, default: uuidv4 },
//     PaymentDoneAmount: { type: String },
//     PaymentMethod: { type: String },
//     Duepayment: { type: String },
//     Total: { type: String },
// });

// const CustomerInfoSchema = new Schema({
//     CustomerName: { type: String },
//     ShopName: { type: String },
//     ContactNo: { type: String },
//     EmailID: { type: String },
//     Billing_Address: { type: String },
//     Shipping_Address: { type: String },
// });

// const TransactionRecordSchema = new Schema({
//    // Automatically generate a unique ID
//     orderId: { type: String },
//     Date: { type: String },
//     Total: { type: String },
//     customerInfo: { type: CustomerInfoSchema },
//     ProductDetails: [ProductDetailsSchema],
//      TransactionData: [TransactionRecordsData]
// });

// const TransactionRecord = mongoose.model('TransactionRecord', TransactionRecordSchema);

// module.exports = TransactionRecord;
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // Import uuid

const Schema = mongoose.Schema;

// Schema for selection details
const SelectionSchema = new Schema({
    size: { type: String, required: true },
    quantity: { type: Number, required: true }
});

// Schema for dispatch and shipping details
const DispatchShippingDetailsSchema = new Schema({
    DispatchID: { type: String, default: '' },
    EstimatedDeliveryDate: { type: Date, default: null },
    DriverName: { type: String, default: '' },
    ContactNumber: { type: String, default: '' },
    VehicleNumber: { type: String, default: '' },
    TaxAndDuties: { type: String, default: '' },
    Insurance: { type: String, default: '' },
    RefundStatus: { type: String, default: '' },
    RefundReasons: { type: String, default: '' },
    RejectRefundReasons: { type: String, default: '' },
    RefundDate: { type: Date, default: null },
    OrderStatus: { type: String, default: 'Pending' },
    weight: { type: String, default: '' },
    Category: { type: String, default: '' },
    DispatchStatus: { type: String, default: '' },
    OrderCancelReason: { type: String, default: '' },
    OrderPendingReason: { type: String, default: '' },
});

// Schema for supplier information
const SupplierInfoSchema = new Schema({
    FactoryName: { type: String, required: true },
    FactoryAddress: { type: String, required: true },
    FactoryContact: { type: String, required: true },
    FactoryId: { type: String, required: true },
});

// Schema for product details
const ProductDetailsSchema = new Schema({
    ProductID: { type: String, required: true },
    OrderDate: { type: Date, required: true },
    ProductName: { type: String, required: true },
    MRP: { type: Number, required: true },
    QTY: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    selection: [SelectionSchema],
    dispatchShippingDetails: DispatchShippingDetailsSchema,
    SupplierInfo: SupplierInfoSchema,
});

// Schema for transaction records
const TransactionRecordsData = new Schema({
    TransactionID: { type: String, default: uuidv4 },
    PaymentDoneAmount: { type: Number, required: true },
    PaymentMethod: { type: String, required: true },
    Duepayment: { type: Number, required: true },
    Total: { type: Number, required: true },
});

// Schema for customer information
const CustomerInfoSchema = new Schema({
    CustomerName: { type: String, required: true },
    ShopName: { type: String, required: true },
    ContactNo: { type: String, required: true },
    EmailID: { type: String, required: true },
    Billing_Address: { type: String, required: true },
    Shipping_Address: { type: String, required: true },
});

// Main schema for transaction records
const TransactionRecordSchema = new Schema({
    orderId: { type: String, required: true },
    Date: { type: Date, default: Date.now },
    Total: { type: Number, required: true },
    customerInfo: CustomerInfoSchema,
    ProductDetails: [ProductDetailsSchema],
    TransactionData: [TransactionRecordsData]
});

const TransactionRecord = mongoose.model('TransactionRecord', TransactionRecordSchema);

module.exports = TransactionRecord;
