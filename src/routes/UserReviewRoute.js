// routes/userReviewRoutes.js
const express = require('express');
const ReviewRouter = express.Router();
const userReviewController = require('../controllers/UserReviewContoller');

ReviewRouter.post('/addReview', userReviewController.addReview);
ReviewRouter.get('/product/:productId', userReviewController.getAllReviews);

module.exports = ReviewRouter;
