module.exports = (req, res, next) => {
  try {
    // ✅ Check if user exists
    if (!req.user) {
      return res.status(401).json({ msg: "No user found (auth failed)" });
    }

    // ✅ Check role
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Admin only" });
    }

    next();

  } catch (err) {
    console.log("🔥 ADMIN ERROR:", err.message);
    res.status(500).json({ msg: "Admin middleware error" });
  }
};