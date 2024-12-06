const express = require('express');
const UserRouter = express.Router();
// Adjust the path as per your project structure
const authenticateToken = require('../middleware/auth');
const userController = require('../controllers/UserController');

UserRouter.post('/GetFactories', userController.getFactoriesByCategory);
UserRouter.get('/GetAllFActories', userController.getAllUsers);
UserRouter.get('/factory/:factoryId', userController.getFactoryById);
UserRouter.delete('/DeleteFactory/:id', userController.deleteFactory);
UserRouter.put('/update-factory', userController.UpdateFactory);
UserRouter.post('/FactoryLoginAccess', userController.UpdateIsAllowLogin);
module.exports = UserRouter;
