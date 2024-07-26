module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        console.log(`Redirect URL saved: ${req.session.redirectUrl}`); // Debug log
        req.flash("error", "You must be logged in");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
        console.log(`Redirect URL set in locals: ${res.locals.redirectUrl}`); // Debug log
    }
    next();
};
