// Ensure user is authenticated
exports.ensureAuthenticated = (req, res, next) => {
    if(req.session.user) {
        return next();
    }
    res.redirect("/login");
};

// Ensure user is sales agent
exports.ensureAgent = (req, res, next) => {
  if (req.session.user && req.session.user.role === "Attendants") {
    return next();
  }
  res.redirect("/");
};

exports.ensureManager = (req, res, next) => {
  if (req.session.user && req.session.user.role === "Manager") {
    return next();
  }
  res.redirect("/");
};
