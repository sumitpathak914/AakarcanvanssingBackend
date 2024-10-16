const express = require('express');
const UserRouter = express.Router();
// Adjust the path as per your project structure
const authenticateToken = require('../middleware/auth');
const userController = require('../controllers/UserController');

UserRouter.post('/GetFactories', authenticateToken, userController.getFactoriesByCategory);
UserRouter.get('/GetAllFActories', authenticateToken, userController.getAllUsers);
UserRouter.get('/factory/:factoryId', userController.getFactoryById);
UserRouter.delete('/DeleteFactory/:id', userController.deleteFactory);
UserRouter.put('/update-factory', userController.UpdateFactory);
module.exports = UserRouter;
