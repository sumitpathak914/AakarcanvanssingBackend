const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderTrackingDetailsSchema = new Schema({
    Place: { type: Boolean, },
    PlaceNote: { type: String, },
    Shipped: { type: Boolean, },
    ShippedNote: { type: String, },
    Delivery: { type: Boolean, },
    DeliveryNote: { type: String, },
    Delivered: { type: Boolean, },
    DeliveredNote: { type: String, }
});

const DispatchShippingDetailsSchema = new Schema({
    DispatchID: { type: Number, },
    EstimatedDeliveryDate: { type: Date, },
    DriverName: { type: String, },
    ContactNumber: { type: String, },
    VehicleNumber: { type: String, },
    TaxAndDuties: { type: String, },
    Insurance: { type: String, },
    RefundStatus: { type: String, },
    OrderStatus: { type: String, },
    OrderCancelReason: { type: String, },
    OrderPendingReason: { type: String, },
});

const SupplierInfoSchema = new Schema({
    FactoryName: { type: String, },
    FactoryAddress: { type: String, },
    FactoryContact: { type: String, },
    FactoryEmailID: { type: String, }
});

const ProductDetailsSchema = new Schema({
    ProductID: { type: String, },
    Supplier: { type: String, },
    MRP: { type: String, },
    QTY: { type: String, },
    Total: { type: String, },
    Payment: { type: String, },
    Duepayment: { type: String, },
    weight: { type: String, },
    ItemCategory: { type: String, },
    dispatchShippingDetails: { type: DispatchShippingDetailsSchema, },
    OrderTrackingDetails: { type: OrderTrackingDetailsSchema, },
    SupplierInfo: { type: SupplierInfoSchema, }
});

const CustomerInfoSchema = new Schema({
    CustomerName: { type: String, },
    ShopName: { type: String, },
    ContactNo: { type: String, },
    EmailID: { type: String, },
    PaymentMethod: { type: String, }
});

const OrderSchema = new Schema({
    customerInfo: { type: CustomerInfoSchema, },
    ProductDetails: { type: [ProductDetailsSchema], } // Array of products
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
