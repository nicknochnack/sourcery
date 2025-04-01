const express = require("express");
const userController = require("../controller/userController");
const passport = require("passport");
const router = express.Router();

router.post("/register", userController.create);
router.post("/login", userController.login);
router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password", userController.resetPassword);
router.get(
  "/me",
  passport.authenticate("jwt", { session: false }),
  userController.me
);
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  userController.getAll
);

module.exports = router;
