const express = require('express');
const Commissionrouter = express.Router();
const { createCommissionSlab, getCommissionSlabs, deleteCommissionSlab, updateCommissionSlab, getCommissionSlabsForAddProduct, generateFactoryInvoice } = require('../controllers/CommissionController');
const authenticateToken = require('../middleware/auth');

Commissionrouter.post('/CreateCommission-slab', createCommissionSlab);
Commissionrouter.get('/GetCommission-slabForCommissionSlab', getCommissionSlabs);
Commissionrouter.get('/GetCommission-slab', getCommissionSlabsForAddProduct);
Commissionrouter.delete('/DeleteCommission-slab/:id', authenticateToken, deleteCommissionSlab);
Commissionrouter.patch('/UpdateCommission-slab/:id', authenticateToken, updateCommissionSlab);

module.exports = Commissionrouter;