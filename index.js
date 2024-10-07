const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require("mongoose");
const dotenv = require('dotenv');

dotenv.config();

const loginRouter = require('./src/routes/loginRoutes');
const productRoutes = require('./src/routes/AddProductRoute');
const QuatationRoutes = require('./src/routes/QuattionRoute');
const FactoryRoutes = require('./src/routes/FactoryRoute');
const path = require('path');
const RegisterRouter = require('./src/routes/RegisterRoute');
const UserRouter = require('./src/routes/UserRoute');

const OrderRouter = require('./src/routes/OrderRoute');
const Commissionrouter = require('./src/routes/CommissionSlabRoute');
const ReviewRouter = require('./src/routes/UserReviewRoute');
const Dealerrouter = require('./src/routes/DealerRoute');
const transactionRouter = require('./src/routes/TrasactionRecordsRoute');
const PaymentRequestrouter = require('./src/routes/PaymentRequestRoute');

const PurchaseReturnrouter = require('./src/routes/PurchaseReturnRoute');

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.json({ limit: '100mb' })); // Increase the limit as needed
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.get('/', (req, res) => {
    res.status(200).send('API is working!');
});
// Routes
app.use('', loginRouter);
app.use('/products', productRoutes);
app.use('/Quatation', QuatationRoutes);
app.use('/Order', OrderRouter);
app.use('/Factory', FactoryRoutes);
app.use('', RegisterRouter);
app.use('', UserRouter);
app.use('/', Commissionrouter);
app.use('/reviews', ReviewRouter);
app.use('/Dealer', Dealerrouter);
app.use('/', transactionRouter);
app.use('/payments', PaymentRequestrouter);
app.use('/purchase-return', PurchaseReturnrouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/asset', express.static(path.join(__dirname, 'src', 'asset')));



// MongoDB connection
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB Connected...");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });
