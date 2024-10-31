import passport from "passport";

export const isAuth = () => {
  return passport.authenticate("jwt");
};

export const sanitizeUser = (user) => {
  return { id: user.id, role: user.role };
};

// export const cookieExtractor = function (req) {
//   let token = null;
//   if (req && req.cookies) {
//     token = req.cookies["jwt"];
//   }
//   return token;
// };
export const cookieExtractor = function (req) {
  let token = null;
  if (req.headers && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.slice(7);
    }
  }

  // if (req && req.cookies) {
  //   token = req.cookies["jwt"];
  // }
  return token;
};
