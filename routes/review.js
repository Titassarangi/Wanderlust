const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");  // Correctly import validateReview

router.post("/", isLoggedIn, validateReview, wrapAsync(async (req, res) => {
    const listingId = req.params.id;
    try {
        const listing = await Listing.findById(listingId);
        if (!listing) {
            throw new ExpressError(404, "Listing not found");
        }
        const newReview = new Review(req.body.review);
        newReview.author = req.user._id;
        listing.reviews.push(newReview);
        console.log(newReview);
        await newReview.save();
        await listing.save();
        req.flash("success", "New review saved");
        res.redirect(`/listings/${listing._id}`);
        console.log("New review saved");
    } catch (error) {
        console.error("Error saving review:", error);
        if (error instanceof ExpressError) {
            res.status(error.statusCode).render("error.ejs", { error });
        } else {
            res.status(500).render("error.ejs", { error: { message: "Internal Server Error" } });
        }
    }
}));

router.delete("/:reviewId", isLoggedIn, isReviewAuthor , wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;
