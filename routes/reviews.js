const express = require("express");
const router = express.Router({ mergeParams: true });

const Chainagri = require("../models/chainagri");
const Review = require("../models/review");
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const catchAsync = require("../utils/catchAsync");
const { createReview } = require("../controllers/reviews");





router.post('/',isLoggedIn, validateReview, catchAsync(createReview))

router.delete('/:reviewId',isLoggedIn,isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Chainagri.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/chainagri/${id}`);
}))

module.exports = router;