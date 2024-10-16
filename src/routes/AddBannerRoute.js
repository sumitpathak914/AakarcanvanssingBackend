const express = require('express');
const Bannerrouter = express.Router();
const bannerController = require('../controllers/AddBannerController');

// Route for adding a banner (with image upload)
Bannerrouter.post('/add', bannerController.addBanner);

// Route for fetching all banners
Bannerrouter.get('/GetBanner', bannerController.getAllBanners);
Bannerrouter.delete('/delete/:id', bannerController.deleteBanner);
module.exports = Bannerrouter;
