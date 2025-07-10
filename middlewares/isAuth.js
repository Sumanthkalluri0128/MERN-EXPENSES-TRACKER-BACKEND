const jwt = require("jsonwebtoken");

const isAuthenticated = async (req, resizeBy, next) => {
  //get token from header
  const headerObj = req.headers;
  const token = headerObj?.authorization?.split(" ")[1];
  //!verify token
  const verifyToken = jwt.verify(token, "mytokengenerate", (err, decoded) => {
    console.log(decoded);
    if (err) {
      return false;
    } else {
      return decoded;
    }
  });
  if (verifyToken) {
    //!save the user req obj
    req.user = verifyToken.id;
    next();
  } else {
    const err = new Error("Token expired, login again");
    next(err);
  }
  console.log("hi");
};

module.exports = isAuthenticated;
