const { verify } = require("jsonwebtoken");

module.exports = {
  isAuth,
};

function isAuth(req, res, next) {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }
  const token = authHeader.split(" ")[1];
  if (!token || token == "") {
    req.isAuth = false;
    return next();
  }
  try {
    const tokenInfo = verify(token, process.env.TOKEN_SECRET);
    if (!tokenInfo) {
      throw new Error();
    }

    req.isAuth = true;
    req.userId = tokenInfo.userId;
    return next();
  } catch (error) {
    req.isAuth = false;
    return next();
  }
}
