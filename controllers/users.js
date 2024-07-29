const User = require("../models/user");
module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
}
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
}
module.exports.login = (req, res) => {
    req.flash("success", "Welcome back to WanderLust!");
    const redirectUrl = res.locals.redirectUrl || '/listings'; // Default redirect to /listings
    console.log(`Redirecting to: ${redirectUrl}`); // Debug log
    delete res.locals.redirectUrl; // Clear the redirect URL from locals
    res.redirect(redirectUrl);
}
module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to WanderLust");
            const redirectUrl = req.session.redirectUrl || "/listings"; // Correcting here to use session
            console.log(`Redirecting to: ${redirectUrl}`); // Debug log
            delete req.session.redirectUrl; // Clear the redirect URL from the session
            res.redirect(redirectUrl);
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash("success", "You are logged out now");
        res.redirect("/listings");
    });
};