const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const decoded = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    
    if(decoded.exp < Date.now() / 1000){
      return res.status(401).json({
        msg: "Authorization token expired",
        data: null,
      });
    }
    req.userData = decoded; // DO SOMETHING WITH LOGGED IN USER DATA
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Authorization token missing or invalid",
      data: null,
    });
  }
};
