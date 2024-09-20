const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
    orderId: {type: String},
    paymentDoneAmount: { type: String, },
    Total: { type: String, },
    paymentMethod: { type: String, enum: ['bank', 'cheque', 'cash'],  },
    duePayment: { type: String,},
    transactionDate: { type: Date,},
    bankDetails: {
        bankName: { type: String },
        accountHolderName: { type: String },
        accountNumber: { type: String },
        ifscCode: { type: String },
        paymentAmount: { type: String }
    },
    chequeDetails: {
        bankName: { type: String },
        accountHolderName: { type: String },
        accountNumber: { type: String },
        chequeNumber: { type: String },
        paymentAmount: { type: String }
    },
    cashDetails: {
        paymentAmount: { type: String }
    }
});

const Payment = mongoose.model('PaymentRequest', PaymentSchema);
module.exports = Payment;
