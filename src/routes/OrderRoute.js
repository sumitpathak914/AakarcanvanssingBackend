const express = require('express');
const OrderRouter = express.Router();

const OrderManagmentController = require('../controllers/OrderManagmentController'); // Adjust the path as per your project structure
const authenticateToken = require('../middleware/auth');



// Define routes with multer middleware

OrderRouter.post('/CreateOrder', authenticateToken, OrderManagmentController.CreateOrder);
OrderRouter.get('/GetAllOrderDetails', authenticateToken, OrderManagmentController.GetAllOrdersDetails);
OrderRouter.post('/GetOrderDetails', authenticateToken, OrderManagmentController.GetOrderDetails);
module.exports = OrderRouter;
