const express = require('express');
const Commissionrouter = express.Router();
const { createCommissionSlab, getCommissionSlabs, deleteCommissionSlab, updateCommissionSlab } = require('../controllers/CommissionController');
const authenticateToken = require('../middleware/auth');

Commissionrouter.post('/CreateCommission-slab', authenticateToken, createCommissionSlab);
Commissionrouter.get('/GetCommission-slab', authenticateToken,  getCommissionSlabs);
Commissionrouter.delete('/DeleteCommission-slab/:id', authenticateToken, deleteCommissionSlab);
Commissionrouter.patch('/UpdateCommission-slab/:id', authenticateToken, updateCommissionSlab );
module.exports = Commissionrouter;