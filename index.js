// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const mongoose = require("mongoose");
// const dotenv = require('dotenv');
// const path = require('path');
// dotenv.config();

// const loginRouter = require('./src/routes/loginRoutes');
// const productRoutes = require('./src/routes/AddProductRoute');
// const QuatationRoutes = require('./src/routes/QuattionRoute');
// const FactoryRoutes = require('./src/routes/FactoryRoute');

// const RegisterRouter = require('./src/routes/RegisterRoute');
// const UserRouter = require('./src/routes/UserRoute');

// const OrderRouter = require('./src/routes/OrderRoute');
// const Commissionrouter = require('./src/routes/CommissionSlabRoute');
// const ReviewRouter = require('./src/routes/UserReviewRoute');
// const Dealerrouter = require('./src/routes/DealerRoute');
// const transactionRouter = require('./src/routes/TrasactionRecordsRoute');
// const PaymentRequestrouter = require('./src/routes/PaymentRequestRoute');

// const PurchaseReturnrouter = require('./src/routes/PurchaseReturnRoute');
// const Bannerrouter = require('./src/routes/AddBannerRoute');
// const dealWeekrouter = require('./src/routes/DealOfTheWeekRoute');
// const CountRouter = require('./src/routes/CountPageRoute');
// const Testimonialsrouter = require('./src/routes/TestimonalsRoute');
// const TermsAndConditionrouter = require('./src/routes/TermsAndConditionRoute');
// const Contactrouter = require('./src/routes/ContactRoute');

// const app = express();

// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(bodyParser.json());
// app.use(cors());
// app.use(express.json({ limit: '100mb' })); // Increase the limit as needed
// app.use(express.urlencoded({ limit: '100mb', extended: true }));
// app.get('/', (req, res) => {
//     res.status(200).send('API is working!');
// });
// // Routes
// app.use('', loginRouter);
// app.use('/products', productRoutes);
// app.use('/Quatation', QuatationRoutes);
// app.use('/Order', OrderRouter);
// app.use('/Factory', FactoryRoutes);
// app.use('', RegisterRouter);
// app.use('', UserRouter);
// app.use('/', Commissionrouter);
// app.use('/reviews', ReviewRouter);
// app.use('/Dealer', Dealerrouter);
// app.use('/', transactionRouter);
// app.use('/payments', PaymentRequestrouter);
// app.use('/purchase-return', PurchaseReturnrouter);
// app.use('/asset', express.static(path.join(__dirname, 'src', 'asset')));
// app.use('/HomeBanner', Bannerrouter);
// app.use('/', dealWeekrouter);
// app.use('/', CountRouter);
// app.use('/', Testimonialsrouter);
// app.use('/', TermsAndConditionrouter);
// app.use('/', Contactrouter)
// app.use('/uploads', express.static(path.join(__dirname, './src/uploads')));

// app.use(express.static(path.join(__dirname, '../backend/src/build')));


// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../backend/src/build', 'index.html'));
// });
// // MongoDB connection
// mongoose
//     .connect(process.env.MONGODB_URI)
//     .then(() => {
//         console.log("MongoDB Connected...");
//         app.listen(PORT, () => {
//             console.log(`Server is running on port ${PORT}`);
//         });
//     })
//     .catch((err) => {
//         console.error("MongoDB connection error:", err);
//     });

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

const loginRouter = require('./src/routes/loginRoutes');
const productRoutes = require('./src/routes/AddProductRoute');
const QuatationRoutes = require('./src/routes/QuattionRoute');
const FactoryRoutes = require('./src/routes/FactoryRoute');

const RegisterRouter = require('./src/routes/RegisterRoute');
const UserRouter = require('./src/routes/UserRoute');

const OrderRouter = require('./src/routes/OrderRoute');
const Commissionrouter = require('./src/routes/CommissionSlabRoute');
const ReviewRouter = require('./src/routes/UserReviewRoute');
const Dealerrouter = require('./src/routes/DealerRoute');
const transactionRouter = require('./src/routes/TrasactionRecordsRoute');
const PaymentRequestrouter = require('./src/routes/PaymentRequestRoute');

const PurchaseReturnrouter = require('./src/routes/PurchaseReturnRoute');
const Bannerrouter = require('./src/routes/AddBannerRoute');
const dealWeekrouter = require('./src/routes/DealOfTheWeekRoute');
const CountRouter = require('./src/routes/CountPageRoute');
const Testimonialsrouter = require('./src/routes/TestimonalsRoute');
const TermsAndConditionrouter = require('./src/routes/TermsAndConditionRoute');
const Contactrouter = require('./src/routes/ContactRoute');
const countRouter = require('./src/routes/CountRoute');


const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.json({ limit: '100mb' })); // Increase the limit as needed
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// API Routes
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
app.use('/HomeBanner', Bannerrouter);
app.use('/', dealWeekrouter);
app.use('/', CountRouter);
app.use('/', Testimonialsrouter);
app.use('/', TermsAndConditionrouter);
app.use('/', Contactrouter);
app.use('/DashboardCount', countRouter);
app.get('/clear-cache', (req, res) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');

    res.send('Cache cleared!');
});
// Serve static assets from the 'src/asset' folder
app.use('/asset', express.static(path.join(__dirname, 'src', 'asset')));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, './src/uploads')));

// Serve the React app from the build folder in 'src'
app.use(express.static(path.join(__dirname, './src/build')));

// Catch-all route to serve the React app's index.html for any other routes (SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './src/build', 'index.html'));
});
app.get('/', (req, res) => {
    res.send('Server is running on http://localhost:' + PORT);
});
// MongoDB connection
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB Connected...");
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });

