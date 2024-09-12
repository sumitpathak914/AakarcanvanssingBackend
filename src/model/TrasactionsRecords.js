// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// // Define the schema for supplier info
// const SupplierInfoSchema = new Schema({
//     FactoryName: String,
//     FactoryAddress: String,
//     FactoryContact: String,
//     FactoryID: String
// });

// // Define the schema for order tracking details
// const OrderTrackingDetailsSchema = new Schema({
//     Place: Boolean,
//     PlaceNote: String,
//     Shipped: Boolean,
//     ShippedNote: String,
//     Delivered: Boolean,
//     DeliveredNote: String,
//     Out_for_Delivery: Boolean,
//     Out_for_Delivery_Note: String
// });

// // Define the schema for dispatch shipping details
// const DispatchShippingDetailsSchema = new Schema({
//     DispatchID: String,
//     EstimatedDeliveryDate: String,
//     DriverName: String,
//     ContactNumber: String,
//     VehicleNumber: String,
//     TaxAndDuties: String,
//     Insurance: String,
//     RefundStatus: String,
//     RefundReasons: String,
//     RejectRefundReasons: String,
//     RefundDate: String,
//     OrderStatus: String,
//     weight: String,
//     Category: String,
//     DispatchStatus: String,
//     OrderCancelReason: String,
//     OrderPendingReason: String
// });

// // Define the schema for product details
// const ProductDetailSchema = new Schema({
//     ProductName: String,
//     ProductID: String,
//     BagSizeAndQTY: String,
//     SupplierInfo: SupplierInfoSchema,
//     commission: {
//         dealer30Kg: Number,
//         supplier30Kg: Number,
//         dealer50Kg: Number,
//         supplier50Kg: Number,
//         dealer70Kg: Number,
//         supplier70Kg: Number,
//         _id: String
//     },
//     OrderDate: String,
//     MRP: Number,
//     discount: String,
//     selection: [{
//         size: String,
//         quantity: Number
//     }],
//     dispatchShippingDetails: DispatchShippingDetailsSchema,
//     OrderTrackingDetails: OrderTrackingDetailsSchema
// });

// // Define the schema for customer info
// const CustomerInfoSchema = new Schema({
//     CustomerName: String,
//     ShopName: String,
//     ContactNo: String,
//     EmailID: String,
//     Billing_Address: String,
//     Shipping_Address: String
// });

// // Define the schema for transaction records
// const TransactionRecordSchema = new Schema({
//     PurchaseTotalAmount: String,
//     PaymentDoneAmount: Number,
//     DuePayment: String,
//     PaymentMethod: String,
//     OrderId: String,
//     TransactionID: String,
//     Date: Date,
//     PurchaseFrom: String,
//     ProductDetails: [ProductDetailSchema],
//     customerInfo: CustomerInfoSchema
// });

// // Create the model from the schema
// const TransactionRecord = mongoose.model('TransactionRecord', TransactionRecordSchema);

// module.exports = TransactionRecord;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// const OrderTrackingDetailsSchema = new Schema({
//     Place: { type: Boolean, },
//     PlaceNote: { type: String, },
//     Shipped: { type: Boolean, },
//     ShippedNote: { type: String, },
//     Delivered: { type: Boolean, },
//     DeliveredNote: { type: String, },
//     Out_for_Delivery: { type: Boolean, },
//     Out_for_Delivery_Note: { type: String, },
// });
// const CommissionSchema = new Schema({
//     dealer30Kg: { type: Number, required: true },
//     supplier30Kg: { type: Number, required: true },
//     dealer50Kg: { type: Number, required: true },
//     supplier50Kg: { type: Number, required: true },
//     dealer70Kg: { type: Number, required: true },
//     supplier70Kg: { type: Number, required: true }
// });

const SelectionSchema = new Schema({
    size: { type: String, required: true },
    quantity: { type: Number, required: true }
});

const DispatchShippingDetailsSchema = new Schema({
    DispatchID: { type: String, },
    EstimatedDeliveryDate: { type: Date, },
    DriverName: { type: String, },
    ContactNumber: { type: String, },
    VehicleNumber: { type: String, },
    TaxAndDuties: { type: String, },
    Insurance: { type: String, },
    RefundStatus: { type: String, },
    RefundReasons: { type: String, },
    RejectRefundReasons: { type: String, },
    RefundDate: { type: String, },
    OrderStatus: { type: String, },
    weight: { type: String, },
    Category: { type: String, },
    DispatchStatus: { type: String, },
    OrderCancelReason: { type: String, },
    OrderPendingReason: { type: String, },
});

const SupplierInfoSchema = new Schema({
    FactoryName: { type: String, },
    FactoryAddress: { type: String, },
    FactoryContact: { type: String, },
    FactoryId: { type: String, },
});

const ProductDetailsSchema = new Schema({
    ProductID: { type: String, },
    OrderDate: { type: String, },
    ProductName: { type: String, },
    MRP: { type: String, },
    QTY: { type: String, },
    discount: { type: String, },
    selection: [SelectionSchema],
    dispatchShippingDetails: { type: DispatchShippingDetailsSchema, },
    // OrderTrackingDetails: { type: OrderTrackingDetailsSchema, },
    SupplierInfo: { type: SupplierInfoSchema, },
    // commission: { type: CommissionSchema, required: true }
});

const CustomerInfoSchema = new Schema({
    CustomerName: { type: String, },
    ShopName: { type: String, },
    ContactNo: { type: String, },
    EmailID: { type: String, },
    Billing_Address: { type: String, },
    Shipping_Address: { type: String, },
});

const TransactionRecordSchema = new Schema({
    orderId: { type: String, },
    Total: { type: String, },
    PaymentDoneAmount: { type: String, },
    PaymentMethod: { type: String, },
    Duepayment: { type: String, },
    customerInfo: { type: CustomerInfoSchema, },
    ProductDetails: { type: [ProductDetailsSchema], } // Array of products
});

const Order = mongoose.model('TransactionRecord', TransactionRecordSchema);

module.exports = Order;