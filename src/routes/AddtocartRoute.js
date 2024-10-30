const express = require('express');
const Cartrouter = express.Router();
const { addToCart, getCartItems, deleteCartItem } = require('../controllers/AddToCartController');

Cartrouter.post('/add-to-cart', addToCart);
Cartrouter.get('/Get-Cart-Product/:ShopId', getCartItems);
Cartrouter.delete('/Delete-Cart-Product/:ShopId/:ProductId', deleteCartItem);
module.exports = Cartrouter;
