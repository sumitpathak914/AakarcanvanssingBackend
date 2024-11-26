const express = require('express');
const OrderRouter = express.Router();
const app = express();
const OrderManagmentController = require('../controllers/OrderManagmentController'); // Adjust the path as per your project structure
const authenticateToken = require('../middleware/auth');
app.use(express.json({ limit: '200mb' })); // Adjust limit as necessary
app.use(express.urlencoded({ limit: '200mb', extended: true }));

// Define routes with multer middleware

OrderRouter.post('/CreateOrder', OrderManagmentController.CreateOrder);
OrderRouter.get('/GetAllOrderDetails', OrderManagmentController.GetAllOrdersDetails);
OrderRouter.post('/GetOrderDetails', OrderManagmentController.GetOrderDetails);
OrderRouter.post('/UpdateStatus', OrderManagmentController.UpdateTheOrderStatus);
OrderRouter.get('/GetDispatchList', OrderManagmentController.getDispatchingOrders);
OrderRouter.get('/dispatch-orders/:factoryId', OrderManagmentController.getDispatchingOrdersByFactory);
OrderRouter.post('/UpdateStatusPendingAndCancel', OrderManagmentController.handleOrderActionUpdateAndCancel);
OrderRouter.post('/AddDetailsDispatch', OrderManagmentController.AddDetailsOfDispatch);
OrderRouter.post('/ChangeTheOrderStatus', OrderManagmentController.ChangeTheStatusOfTracking);
OrderRouter.post('/ChangeRefundOrderStatus', OrderManagmentController.ChangeReturnOrderStatus);
OrderRouter.get('/getOrdersByShopId/:ShopId', OrderManagmentController.getOrdersByShopId);
OrderRouter.post('/GetOrderDetails_ForPurchase', OrderManagmentController.GetOrderDetailsForReturn);
OrderRouter.get('/getOrdersByShopIdWithStatus/:ShopId', OrderManagmentController.getOrdersByShopIdWithStatus);
module.exports = OrderRouter;
