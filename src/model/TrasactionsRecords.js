const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for supplier info
const SupplierInfoSchema = new Schema({
    FactoryName: String,
    FactoryAddress: String,
    FactoryContact: String,
    FactoryID: String
});

// Define the schema for order tracking details
const OrderTrackingDetailsSchema = new Schema({
    Place: Boolean,
    PlaceNote: String,
    Shipped: Boolean,
    ShippedNote: String,
    Delivered: Boolean,
    DeliveredNote: String,
    Out_for_Delivery: Boolean,
    Out_for_Delivery_Note: String
});

// Define the schema for dispatch shipping details
const DispatchShippingDetailsSchema = new Schema({
    DispatchID: String,
    EstimatedDeliveryDate: String,
    DriverName: String,
    ContactNumber: String,
    VehicleNumber: String,
    TaxAndDuties: String,
    Insurance: String,
    RefundStatus: String,
    RefundReasons: String,
    RejectRefundReasons: String,
    RefundDate: String,
    OrderStatus: String,
    weight: String,
    Category: String,
    DispatchStatus: String,
    OrderCancelReason: String,
    OrderPendingReason: String
});

// Define the schema for product details
const ProductDetailSchema = new Schema({
    ProductName: String,
    ProductID: String,
    BagSizeAndQTY: String,
    SupplierInfo: SupplierInfoSchema,
    commission: {
        dealer30Kg: Number,
        supplier30Kg: Number,
        dealer50Kg: Number,
        supplier50Kg: Number,
        dealer70Kg: Number,
        supplier70Kg: Number,
        _id: String
    },
    OrderDate: String,
    MRP: Number,
    discount: String,
    selection: [{
        size: String,
        quantity: Number
    }],
    dispatchShippingDetails: DispatchShippingDetailsSchema,
    OrderTrackingDetails: OrderTrackingDetailsSchema
});

// Define the schema for customer info
const CustomerInfoSchema = new Schema({
    CustomerName: String,
    ShopName: String,
    ContactNo: String,
    EmailID: String,
    Billing_Address: String,
    Shipping_Address: String
});

// Define the schema for transaction records
const TransactionRecordSchema = new Schema({
    PurchaseTotalAmount: String,
    PaymentDoneAmount: Number,
    DuePayment: String,
    PaymentMethod: String,
    OrderId: String,
    TransactionID: String,
    Date: Date,
    PurchaseFrom: String,
    ProductDetails: [ProductDetailSchema],
    customerInfo: CustomerInfoSchema
});

// Create the model from the schema
const TransactionRecord = mongoose.model('TransactionRecord', TransactionRecordSchema);

module.exports = TransactionRecord;
