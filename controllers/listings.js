const Listing = require("../models/listing");
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
}
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new");
}
module.exports.showListing = async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews", populate:{
        path:"author",
    }}).populate("owner");

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show", { listing });
}
module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(url, "..", filename);
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist ");
        res.redirect("/listings");
    } else {
        res.render("listings/edit", { listing });
    }
}
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing updated");
    res.redirect(`/listings/${id}`);
}
module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findOneAndDelete({ _id: id });
    req.flash("success", "Listing deleted");
    res.redirect("/listings");
}