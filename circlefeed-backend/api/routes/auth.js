const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../../environment/environment");
const { sendWelcomeEmail, sendResetPasswordEmail } = require("../emails/email");

router.get("/test", (req, res) => {
  res.status(200).json({ message: "Circle API is working smoothly" });
});

//Routes
router.post("/signup", (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!email || !password || !name) {
    return res.status(422).json({ message: "please add all the fields" });
  }

  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        let response = {
          status: "failed",
          message: "User Already Exists with this email",
        };
        return res.status(400).json(response);
      }
      bcrypt.hash(password, 12).then((hashedpassword) => {
        const user = new User({
          email,
          password: hashedpassword,
          name: name.toLowerCase(),
          pic,
        });
        user
          .save()
          .then((user) => {
            sendWelcomeEmail(user.email, user.name);
            res.status(200).json({ message: "Registered Successfully", user });
          })
          .catch((err) => {
            console.log(err);
            res.status(422).json({ message: "Error occured", err });
          });
      });
    })
    .catch((err) => {
      res.status(422).json({ message: "Registration Failed", err });
    });
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    let response = {
      status: "failed",
      message: "Please add email and password",
    };
    return res.status(422).json(response);
  }
  User.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({ message: "Invalid Email or password" });
    }
    bcrypt
      .compare(password, savedUser.password)
      .then((doMatch) => {
        if (doMatch) {
          const token = jwt.sign({ _id: savedUser._id }, config.JWT_SECRET);
          const { _id, name, email, pic, followers, following } = savedUser;
          res.status(200).json({
            status: "success",
            message: "Successfully Signed In",
            user: { _id, name, email, pic, followers, following },
            token,
          });
        } else {
          return res.status(422).json({ message: "Invalid Email or password" });
        }
      })
      .catch((err) => console.log(err));
  });
});

//  Forgot  password route
router.post("/reset-password", (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
    }
    console.log(buffer);
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email }).then((user) => {
      if (!user) {
        return res
          .status(422)
          .json({ error: "User dont exist with this email" });
      }
      user.resetToken = token;
      user.expireToken = Date.now() + 3600000;
      user.save().then((result) => {
        sendResetPasswordEmail(user.email, token);
        res
          .status(200)
          .json({ message: "Check your Email, sent a reset password link" });
      });
    });
  });
});

// Setting  a new password
router.post("/new-password", (req, res) => {
  const newPassword = req.body.password;
  const sentToken = req.body.token;
  User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
    .then((user) => {
      if (!user) {
        return res.status(422).json({ error: "Try again, session expired" });
      }
      bcrypt.hash(newPassword, 12).then((hashedpassword) => {
        user.password = hashedpassword;
        user.resetToken = undefined;
        user.expireToken = undefined;
        user.save().then((savedUser) => {
          res.json({ message: "Successfully updated password" });
        });
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(422).json({ error: err });
    });
});

module.exports = router;
