const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");

// Define middleware to validate listing data
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// Get all listings
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
}));

// Render form to create new listing
router.get("/new", (req, res) => {
    res.render("listings/new");
});

// Get details of a specific listing
router.get("/:id", wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
    
      req.flash("error", "Listing you requested for does not exist ");
    //   req.flash("Does not exist from 36th line");
     res.redirect("/listings");
     
    }
    //res.render("listings/show.ejs", { listing });
  }));


// Render form to edit a listing
router.get("/:id/edit", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist ");

        // req.flash("Does not exist from 49th line");
        res.redirect("/listings");
    }
    //res.render("listings/edit", { listing });
}));
// Create a new listing
router.post("/", validateListing, wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}));


router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing updated");
    res.redirect(`/listings/${id}`);
}));

// Delete a listing
router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const deletedListing = await Listing.findOneAndDelete({ _id: id });
    console.log(deletedListing);
    req.flash("success", "Listing deleted");
    res.redirect("/listings");
}));

module.exports = router;
