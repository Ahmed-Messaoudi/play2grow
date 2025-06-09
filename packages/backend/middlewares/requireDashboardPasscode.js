function requireDashboardPasscode(req, res, next) {
  const sessionUser = req.session.user;
  const { passcode } = req.query; // Get passcode from the URL query (e.g., ?passcode=1234)

  // Must be logged in
  if (!sessionUser || sessionUser.role !== "parent") {
    return res.status(403).json({ message: "Access denied" });
  }

  // Check if the passcode matches the parent's stored passcode
  if (sessionUser.dashboardPasscode !== passcode) {
    return res.status(401).json({ message: "Incorrect dashboard passcode" });
  }

  // All good, continue to the next handler
  next();
}

module.exports = requireDashboardPasscode;
