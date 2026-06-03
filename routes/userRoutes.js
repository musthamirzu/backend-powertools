const router = require("express").Router();

const auth = require("../middleware/authMiddleware");

const {
  completeProfile,
  getMe,
  getAllUsers
} = require("../controllers/userController");

router.get("/test", (req, res) => {
  res.json({
    msg: "User routes working"
  });
});

router.post("/profile", auth, completeProfile);

router.get("/me", auth, getMe);

router.get("/", auth, getAllUsers);
console.log("AUTH:", auth);
console.log("completeProfile:", completeProfile);
module.exports = router;