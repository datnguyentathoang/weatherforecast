const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "Cần đăng nhập" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (e) {
    res.status(401).json({ msg: "Token sai" });
  }
};
