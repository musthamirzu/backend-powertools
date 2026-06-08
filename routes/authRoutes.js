const router = require("express").Router();
const {register,login,forgotPassword,
  resetPassword,googleLogin} = require("../controllers/authController");

router.post("/register",register);
router.post("/login",login);
router.post("/forgot-password",forgotPassword);
router.put("/reset-password/:token",resetPassword);
router.post(
  "/google",
  googleLogin
);
module.exports = router;