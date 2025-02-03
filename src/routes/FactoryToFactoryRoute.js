const express = require('express');
const FactoryToFactoryOrderRouter = express.Router();
const app = express();
const OrderManagmentController = require('../controllers/FactoryToFactorycontroller');

FactoryToFactoryOrderRouter.post('/CreateOrder', OrderManagmentController.CreateOrder);

FactoryToFactoryOrderRouter.get('/GetOrderById', OrderManagmentController.GetProductsByFactoryId);
FactoryToFactoryOrderRouter.get('/GetPurchaseOrder', OrderManagmentController.GetProductsByCustomerFactoryId);
FactoryToFactoryOrderRouter.post('/updateStatus', OrderManagmentController.UpdateTheOrderStatus);
FactoryToFactoryOrderRouter.post('/GetTrasactionRecords', OrderManagmentController.getTransactionByOrderId);
FactoryToFactoryOrderRouter.post('/addTransaction', OrderManagmentController.addTransaction);
FactoryToFactoryOrderRouter.post('/FactoryToFactoryReport', OrderManagmentController.generateFactoryToFactoryInvoice);
module.exports = FactoryToFactoryOrderRouter;