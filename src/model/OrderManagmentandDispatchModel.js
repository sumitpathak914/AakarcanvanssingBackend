const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderTrackingDetailsSchema = new Schema({
    Place: { type: Boolean, },
    PlaceNote: { type: String, },
    Shipped: { type: Boolean, },
    ShippedNote: { type: String, },
    Delivered: { type: Boolean, },
    DeliveredNote: { type: String, },
    Out_for_Delivery: { type: Boolean, },
    Out_for_Delivery_Note: { type: String, },
});
const CommissionSchema = new Schema({
    dealer30Kg: { type: Number, required: true },
    supplier30Kg: { type: Number, required: true },
    dealer50Kg: { type: Number, required: true },
    supplier50Kg: { type: Number, required: true },
    dealer70Kg: { type: Number, required: true },
    supplier70Kg: { type: Number, required: true }
});

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
    OrderTrackingDetails: { type: OrderTrackingDetailsSchema, },
    SupplierInfo: { type: SupplierInfoSchema, },
    commission: { type: CommissionSchema, required: true },
    selectedImages: {
        type: [String], // Array of strings (image paths)
        default: []
    },
});

const CustomerInfoSchema = new Schema({
    CustomerName: { type: String, },
    ShopName: { type: String, },
    ContactNo: { type: String, },
    EmailID: { type: String, },
    Billing_Address: { type: String, },
    Shipping_Address: { type: String, },
});

// Payment Details schema for Bank payments
const BankPaymentDetailsSchema = new Schema({
    BankName: { type: String },
    AccountHolderName: { type: String },
    AccountNumber: { type: String },
    IFSCCode: { type: String },
    PaymentAmount: { type: String }
});

// Payment Details schema for Cheque payments
const ChequePaymentDetailsSchema = new Schema({
    BankName: { type: String },
    AccountHolderName: { type: String },
    ChequeNumber: { type: String },
    PaymentAmount: { type: String }
});

// Main PaymentDetails schema with conditional embedded fields
const PaymentDetailsSchema = new Schema({
    PaymentMethod: { type: String, }, // 'bank' or 'cheque'
    BankDetails: BankPaymentDetailsSchema, // For 'bank' method
    ChequeDetails: ChequePaymentDetailsSchema // For 'cheque' method
});
const OrderSchema = new Schema({
    orderId: { type: String, },
    Total: { type: String, },
    ShopId: { type: String, },
    PaymentDoneAmount: { type: String, },
    PaymentMethod: { type: String, },
    Duepayment: { type: String, },
    PaymentDetails: { type: PaymentDetailsSchema },
    customerInfo: { type: CustomerInfoSchema, },
    
    ProductDetails: { type: [ProductDetailsSchema], } // Array of products
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;