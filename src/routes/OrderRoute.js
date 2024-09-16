const express = require('express');
const OrderRouter = express.Router();

const OrderManagmentController = require('../controllers/OrderManagmentController'); // Adjust the path as per your project structure
const authenticateToken = require('../middleware/auth');



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
module.exports = OrderRouter;
