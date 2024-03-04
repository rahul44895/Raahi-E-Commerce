const JWT = require("jsonwebtoken");
require("dotenv").config();
const decodeToken = (req, res, next) => {
  try {
    let token = req.cookies.authToken;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Token not provided" });
    }
    let data = JWT.verify(token, process.env.JWT_SECRET_KEY);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};
module.exports = decodeToken;
