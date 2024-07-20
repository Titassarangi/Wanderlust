const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}
router.post("/", validateReview, wrapAsync(async (req, res) => {
    const listingId = req.params.id;
    try {
        const listing = await Listing.findById(listingId);
        if (!listing) {
            throw new ExpressError(404, "Listing not found");
        }
        const newReview = new Review(req.body.review);
        listing.reviews.push(newReview);
        await newReview.save();
        await listing.save();
        req.flash("success", "new review saved");
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
router.delete("/:reviewId", wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted");
    res.redirect(`/listings/${id}`);
}));
module.exports = router;