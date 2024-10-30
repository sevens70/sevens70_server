import passport from "passport";

export const isAuth = () => {
  return (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
      if (err) {
        return res.status(500).json({ message: "Internal Server Error" });
      }
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      req.user = user; // Attach the authenticated user to the request
      next(); // Proceed to the next middleware or route handler
    })(req, res, next);
  };
};

export const sanitizeUser = (user) => {
  return { id: user.id, role: user.role };
};

export const cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  return token;
};
