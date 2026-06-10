const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const crypto = require("crypto");
const sendEmail =
  require("../utils/sendEmail");
const { OAuth2Client } =
  require("google-auth-library");

const client =
  new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID
  );

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Check existing user
    const existingUser = await User.findOne({ email });

    // ✅ Check existing admin
    const existingAdmin = await Admin.findOne({ email });

    if (existingUser || existingAdmin) {
      return res.status(400).json({
        msg: "Email already registered"
      });
    }

    // ✅ Hash password
    const hashed = await bcrypt.hash(password, 10);

    // ✅ Create user
    const user = await User.create({
      email,
      password: hashed,
      profileCompleted: false
    });

    // ✅ Create token immediately
    const token = jwt.sign(
      {
        id: user._id,
        role: "user"
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    // ✅ Send token + user
    res.status(201).json({
      msg: "Registered successfully",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: "user",
        profileCompleted: false
      }
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      msg: "Register error"
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔥 Check admin first
    let account = await Admin.findOne({ email });
    let role = "admin";

    if (!account) {
      account = await User.findOne({ email });
      role = "user";
    }

    if (!account) {
      return res.status(400).json({ msg: "User not found" });
    }

    const match = await bcrypt.compare(password, account.password);
    if (!match) {
      return res.status(400).json({ msg: "Wrong password" });
    }

    const token = jwt.sign(
      { id: account._id, role },
      process.env.JWT_SECRET
    );

    res.json({
      token,
      user: {
        id: account._id,
        email: account.email,
        role,

        // 🔥 KEY LOGIC
        profileCompleted:
          role === "admin" ? true : account.profileCompleted
      }
    });

  } catch (err) {
    res.status(500).json({ msg: "Login error" });
  }
};

exports.forgotPassword =
  async (req, res) => {
    try {

      const { email } =
        req.body;

      const user =
        await User.findOne({
          email,
        });

      if (!user) {
        return res
          .status(404)
          .json({
            msg:
              "User not found",
          });
      }

      const resetToken =
        crypto
          .randomBytes(32)
          .toString("hex");

      user.resetPasswordToken =
        resetToken;

      user.resetPasswordExpire =
        Date.now() +
        15 * 60 * 1000;

      await user.save();

      const resetUrl =
        `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
      console.log(
  "FRONTEND_URL =",
  process.env.FRONTEND_URL
);
      await sendEmail(
        user.email,
        "Reset Password",
        `
        <h2>Password Reset</h2>

        <p>
          Click below link:
        </p>

        <a href="${resetUrl}">
          Reset Password
        </a>
        `
      );

      res.json({
        msg:
          "Password reset email sent",
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        msg:
          "Server Error",
      });

    }
  };


  exports.resetPassword =
  async (req, res) => {
    try {

      const { token } =
        req.params;

      const { password } =
        req.body;

      const user =
        await User.findOne({
          resetPasswordToken:
            token,

          resetPasswordExpire:
          {
            $gt: Date.now(),
          },
        });

      if (!user) {
        return res
          .status(400)
          .json({
            msg:
              "Invalid or expired token",
          });
      }

      user.password =
        await bcrypt.hash(
          password,
          10
        );

      user.resetPasswordToken =
        undefined;

      user.resetPasswordExpire =
        undefined;

      await user.save();

      res.json({
        msg:
          "Password updated successfully",
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        msg:
          "Server Error",
      });

    }
  };


  exports.googleLogin =
  async (req, res) => {
    try {

      const { credential } =
        req.body;

      const ticket =
        await client.verifyIdToken({
          idToken: credential,
          audience:
            process.env.GOOGLE_CLIENT_ID,
        });

      const payload =
        ticket.getPayload();

      const {
        sub,
        email,
        name,
         picture,
      } = payload;

      let user =
        await User.findOne({
          email,
        });

      if (!user) {

        user =
          await User.create({
            name,
            email,
            googleId: sub,
             profileImage: picture,
            profileCompleted:
              false,
          });

      }

      const token =
        jwt.sign(
          {
            id: user._id,
            role: "user",
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "7d",
          }
        );

      res.json({
        token,

        user: {
          id: user._id,
          email:
            user.email,
          name:
            user.name,

          role: "user",

          profileCompleted:
            user.profileCompleted,
        },
      });

    } catch (err) {
  console.log(
    "GOOGLE LOGIN ERROR:",
    err
  );

  res.status(500).json({
    msg: err.message,
  });
}
  };