const express = require('express');
const OrderRouter = express.Router();
const app = express();
const OrderManagmentController = require('../controllers/OrderManagmentController'); // Adjust the path as per your project structure
const authenticateToken = require('../middleware/auth');
app.use(express.json({ limit: '200mb' })); // Adjust limit as necessary
app.use(express.urlencoded({ limit: '200mb', extended: true }));

// Define routes with multer middleware

OrderRouter.post('/CreateOrder', OrderManagmentController.CreateOrder);
OrderRouter.get('/GetAllOrderDetails', authenticateToken, OrderManagmentController.GetAllOrdersDetails);
OrderRouter.post('/GetOrderDetails', authenticateToken, OrderManagmentController.GetOrderDetails);
OrderRouter.post('/UpdateStatus', authenticateToken, OrderManagmentController.UpdateTheOrderStatus);
OrderRouter.get('/GetDispatchList', authenticateToken, OrderManagmentController.getDispatchingOrders);
OrderRouter.post('/UpdateStatusPendingAndCancel', authenticateToken, OrderManagmentController.handleOrderActionUpdateAndCancel);
OrderRouter.post('/AddDetailsDispatch', authenticateToken, OrderManagmentController.AddDetailsOfDispatch);
OrderRouter.post('/ChangeTheOrderStatus', authenticateToken, OrderManagmentController.ChangeTheStatusOfTracking);
OrderRouter.post('/ChangeRefundOrderStatus', authenticateToken, OrderManagmentController.ChangeReturnOrderStatus);
OrderRouter.get('/getOrdersByShopId/:ShopId', OrderManagmentController.getOrdersByShopId);
OrderRouter.post('/GetOrderDetails_ForPurchase', authenticateToken, OrderManagmentController.GetOrderDetailsForReturn);
module.exports = OrderRouter;
