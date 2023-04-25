const express = require("express");
const router = express.Router({ mergeParams: true });

const Chainagri = require("../models/chainagri");
const Review = require("../models/review");
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const catchAsync = require("../utils/catchAsync");





router.post('/',isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const chainagri = await Chainagri.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    chainagri.reviews.push(review);
    await review.save();
    await chainagri.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/chainagri/${chainagri._id}`);
}))

router.delete('/:reviewId',isLoggedIn,isReviewAuthor,catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Chainagri.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/chainagri/${id}`);
}))

module.exports = router;