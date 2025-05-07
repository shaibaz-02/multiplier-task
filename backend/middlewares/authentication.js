const { validateToken } = require("../services/authentication");
const User = require("../models/user");

function checkForAuthenticationCookie(cookieName) {
  return async (req, res, next) => {
    const tokenCookieValue = req.cookies[cookieName];

    if (!tokenCookieValue) {
      return next();
    }

    try {
      const userPayload = validateToken(tokenCookieValue);

      const user = await User.findById(userPayload._id).select('fullName email profileImageURL');

      if (user) {
        req.user = user;
      }
    } catch (error) {
      console.error("Error validating token or fetching user:", error);
      return res.redirect('/user/signin');
    }

    return next();
  };
}


function isAuthenticated(req, res, next) {
  if (!req.user) {
    return res.redirect("/user/signin");
  }
  next();
}



module.exports = {
  checkForAuthenticationCookie,
  isAuthenticated,
};

