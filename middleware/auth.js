exports.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

exports.ensureAgent = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === "Attendants") {
    return next();
  }
  res.redirect("/");
};

exports.ensureManager = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === "Manager") {
    return next();
  }
  res.redirect("/");
};


// Middleware to check if logged-in user is Manager
function ensureManager(req, res, next) {
  if (req.isAuthenticated() && req.user.role === "Manager") {
    return next();
  }
  res.status(403).send("Only Managers can register attendants.");
}