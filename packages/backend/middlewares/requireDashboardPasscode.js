function requireDashboardPasscode(req, res, next) {
  const sessionUser = req.session.user;

  if (!sessionUser || sessionUser.role !== "parent") {
    return res.status(403).json({ message: "Unauthorized access" });
  }

  const submittedPasscode = req.headers["x-dashboard-passcode"];

  if (!submittedPasscode) {
    return res.status(400).json({ message: "Dashboard passcode is required" });
  }

  if (submittedPasscode !== sessionUser.dashboardPasscode) {
    return res.status(401).json({ message: "Incorrect dashboard passcode" });
  }
  console.log("Session user passcode:", sessionUser.dashboardPasscode);
  console.log("Submitted passcode:", submittedPasscode);

  next();
}

module.exports = requireDashboardPasscode;
