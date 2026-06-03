const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const header = req.headers.authorization;

    // ❌ No header
    if (!header) {
      return res.status(401).json({ msg: "No token provided" });
    }

    // ❌ Wrong format
    if (!header.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "Invalid token format" });
    }

    const token = header.split(" ")[1];

    // ❌ No token after split
    if (!token) {
      return res.status(401).json({ msg: "Token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();

  } catch (err) {
    console.log("🔥 AUTH ERROR:", err.message);
    res.status(401).json({ msg: "Invalid or expired token" });
  }
};