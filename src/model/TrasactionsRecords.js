const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // Import uuid

const Schema = mongoose.Schema;

const getISTDate = () => {
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC +5:30
    const istDate = new Date(now.getTime() + istOffset);
    return istDate;
};

const SelectionSchema = new Schema({
    size: { type: String, required: true },
    quantity: { type: Number, required: true }
});

const DispatchShippingDetailsSchema = new Schema({
    DispatchID: { type: String },
    EstimatedDeliveryDate: { type: Date },
    DriverName: { type: String },
    ContactNumber: { type: String },
    VehicleNumber: { type: String },
    TaxAndDuties: { type: String },
    Insurance: { type: String },
    RefundStatus: { type: String },
    RefundReasons: { type: String },
    RejectRefundReasons: { type: String },
    RefundDate: { type: String },
    OrderStatus: { type: String },
    weight: { type: String },
    Category: { type: String },
    DispatchStatus: { type: String },
    OrderCancelReason: { type: String },
    OrderPendingReason: { type: String },
});

const SupplierInfoSchema = new Schema({
    FactoryName: { type: String },
    FactoryAddress: { type: String },
    FactoryContact: { type: String },
    FactoryId: { type: String },
});

const ProductDetailsSchema = new Schema({
    ProductID: { type: String },
    OrderDate: { type: String },
    ProductName: { type: String },
    MRP: { type: String },
    QTY: { type: String },
    discount: { type: String },
    selection: [SelectionSchema],
    dispatchShippingDetails: { type: DispatchShippingDetailsSchema },
    SupplierInfo: { type: SupplierInfoSchema },
});

const TransactionRecordsData = new Schema({
    TransactionID: { type: String, default: uuidv4 },
    PaymentDoneAmount: { type: String },
    PaymentMethod: { type: String },
    Duepayment: { type: String },
    Total: { type: String },
    TransactionDate: { type: String },
    BankDetails: {
        BankName: { type: String },
        AccountHolderName: { type: String },
        AccountNumber: { type: String },
        IFSCCode: { type: String },
        PaymentAmount: { type: String },
        
    },
    ChequeDetails: {
        BankName: { type: String },
        AccountHolderName: { type: String },
        ChequeNumber: { type: String },
        PaymentAmount: { type: String },
        
    },
    cashDetails:{
        
        PaymentAmount: { type: String },

    }
});

const CustomerInfoSchema = new Schema({
    CustomerName: { type: String },
    ShopName: { type: String },
    ContactNo: { type: String },
    EmailID: { type: String },
    Billing_Address: { type: String },
    Shipping_Address: { type: String },
});

const TransactionRecordSchema = new Schema({
   // Automatically generate a unique ID
    orderId: { type: String },
    Date: { type: String },
    Total: { type: String },
    customerInfo: { type: CustomerInfoSchema },
    ProductDetails: [ProductDetailsSchema],
     TransactionData: [TransactionRecordsData]
});

const TransactionRecord = mongoose.model('TransactionRecord', TransactionRecordSchema);

module.exports = TransactionRecord;
