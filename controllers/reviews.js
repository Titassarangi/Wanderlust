const Listing = require("../models/listing");
const Review = require("../models/review");
const ExpressError = require("../utils/ExpressError.js");

module.exports.createReview = async (req, res) => {
    const listingId = req.params.id;
    try {
        const listing = await Listing.findById(listingId);
        if (!listing) {
            throw new ExpressError(404, "Listing not found");
        }
        const newReview = new Review(req.body.review);
        newReview.author = req.user._id;
        listing.reviews.push(newReview);
        await newReview.save();
        await listing.save();
        req.flash("success", "New review saved");
        res.redirect(`/listings/${listing._id}`);
    } catch (error) {
        console.error("Error saving review:", error);
        if (error instanceof ExpressError) {
            res.status(error.statusCode).render("error.ejs", { message: error.message });
        } else {
            res.status(500).render("error.ejs", { message: "Internal Server Error" });
        }
    }
}

module.exports.destroyReview = async (req, res) => {
    const { id, reviewId } = req.params;
    try {
        await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        await Review.findByIdAndDelete(reviewId);
        req.flash("success", "Review deleted");
        res.redirect(`/listings/${id}`);
    } catch (error) {
        console.error("Error deleting review:", error);
        res.status(500).render("error.ejs", { message: "Internal Server Error" });
    }
}
