
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

const SupplierInfoSchema = new Schema({
    FactoryName: { type: String },
    FactoryAddress: { type: String },
    FactoryContact: { type: String },
    FactoryId: { type: String },
});
const TransactionRecordsData = new Schema({
    TransactionID: { type: String, default: uuidv4 },
    PaymentDoneAmount: { type: String },
    PaymentMethod: { type: String },
    Duepayment: { type: String },
    Total: { type: String },
    TransactionDate: { type: String },
});
const ProductDetailsSchema = new Schema({
    ProductID: { type: String },
    OrderDate: { type: String },
    ProductName: { type: String },
    productTotalAmount: { type: String },
    MRP: { type: String },
    QTY: { type: String },
    discount: { type: String },
    selection: [SelectionSchema],
    SupplierInfo: { type: SupplierInfoSchema },
    TransactionData: [TransactionRecordsData]
});


const CustomerInfoSchema = new Schema({
    CustomerFactoryName: { type: String },
    FactoryName: { type: String },
    FactoryContactNo: { type: String },
    FactoryEmailID: { type: String },
    Billing_Address: { type: String },
    Shipping_Address: { type: String },
});

const TransactionRecordSchema = new Schema({
   
    orderId: { type: String },
    Date: { type: String },
    Total: { type: String },
    customerInfo: { type: CustomerInfoSchema },
    ProductDetails: [ProductDetailsSchema],
     
});

const FactoryToFactoryTransactionRecord = mongoose.model('FactoryToFactoryTransactionRecord', TransactionRecordSchema);

module.exports = FactoryToFactoryTransactionRecord;
