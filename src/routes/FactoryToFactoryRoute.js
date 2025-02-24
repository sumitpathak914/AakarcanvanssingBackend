const express = require('express');
const FactoryToFactoryOrderRouter = express.Router();
const app = express();
const OrderManagmentController = require('../controllers/FactoryToFactorycontroller');

FactoryToFactoryOrderRouter.post('/CreateOrder', OrderManagmentController.CreateOrder);

FactoryToFactoryOrderRouter.get('/GetOrderById', OrderManagmentController.GetProductsByFactoryId);
FactoryToFactoryOrderRouter.get('/GetPurchaseOrder', OrderManagmentController.GetProductsByCustomerFactoryId);
FactoryToFactoryOrderRouter.get('/GetOrderOFFactoryToFactory', OrderManagmentController.GetAllProducts);  
FactoryToFactoryOrderRouter.post('/updateStatus', OrderManagmentController.UpdateTheOrderStatus);
FactoryToFactoryOrderRouter.post('/GetTrasactionRecords', OrderManagmentController.getTransactionByOrderId);
FactoryToFactoryOrderRouter.post('/addTransaction', OrderManagmentController.addTransaction);
FactoryToFactoryOrderRouter.post('/FactoryToFactoryReport', OrderManagmentController.generateFactoryToFactoryInvoice);
FactoryToFactoryOrderRouter.get("/notifications/:factoryId", OrderManagmentController.GetFactoryNotifications);
FactoryToFactoryOrderRouter.put('/notifications/reset-status', OrderManagmentController.resetNotificationStatus);
FactoryToFactoryOrderRouter.delete('/delete', OrderManagmentController.deleteNotification);
module.exports = FactoryToFactoryOrderRouter;
