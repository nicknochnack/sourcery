const express = require("express");
const watsonxController = require("../controller/watsonxController");
const passport = require("passport");
const router = express.Router();

router.post(
  "/generateQuestions",
  passport.authenticate("jwt", { session: false }),
  watsonxController.generateQuestions
);

router.post(
  "/summariseresponse",
  passport.authenticate("jwt", { session: false }),
  watsonxController.summariseResponse
);

module.exports = router;
