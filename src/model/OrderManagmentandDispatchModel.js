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
    Billing_Address: { type: String, },
    Shipping_Address: { type: String, }
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
    OrderStatus: { type: String, },
    weight: { type: String, },
    numberOfItems: { type: String, },
    Category: { type: String, },
    DispatchStatus: { type: String, },
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
    OrderDate: { type: String, },
    PaymentDoneAmount: { type: String, },
    ProductName: { type: String, },
    MRP: { type: String, },
    QTY: { type: String, },
    Total: { type: String, },
    PaymentMethod: { type: String, },
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

});

const OrderSchema = new Schema({
    orderId: { type: String, },
    customerInfo: { type: CustomerInfoSchema, },
    ProductDetails: { type: [ProductDetailsSchema], } // Array of products
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
