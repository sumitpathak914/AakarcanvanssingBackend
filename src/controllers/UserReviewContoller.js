// controllers/userReviewController.js
const UserReview = require('../model/ProductReviewModel');

exports.addReview = async (req, res) => {
    try {
        const { rating, review, email,  productId ,name} = req.body;
        const newReview = new UserReview({ rating, review, email, productId,name });
        await newReview.save();
        res.status(201).json({ result: true, statusCode: 201, message: "Review added successfully", review: newReview });
    } catch (error) {
        res.status(500).json({ result: false, statusCode: 500, message: 'Error adding review', error });
    }
};

exports.getAllReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const reviews = await UserReview.find({ productId });
        res.status(200).json({ result: true, statusCode: 200, message: "Review Get successfully", reviewList: reviews });
    } catch (error) {
        res.status(500).json({ result: false, statusCode: 500, message: 'Error fetching reviews', error });
    }
};
