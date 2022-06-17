const express = require("express");
const passport = require("passport");
const { Router } = express;
const router = new Router();

router.get("/", (req, res) => {
  res.render("pages/signup");
});

router.get("/failSignup", (req, res) => {
  res.render("pages/failSignup");
});

router.get("/login", (req, res) => {
  res.render("pages/login");
});

router.get("/failLogin", (req, res) => {
  res.render("pages/failLogin");
});

router.post(
  "/signup",
  passport.authenticate("local-signup", {
    successRedirect: "/login",
    failureRedirect: "/failSignup",
  })
);

router.post(
  "/login",
  passport.authenticate("local-login", {
    successRedirect: "/home",
    failureRedirect: "/failLogin",
  })
);

module.exports = router;
