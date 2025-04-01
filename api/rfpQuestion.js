const express = require("express");
const router = express.Router();
const RFPQuestionController = require("../controller/rfpQuestionController");
const passport = require("passport");

// Create new question
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  RFPQuestionController.create
);

// Get questions for specific RFP
router.get(
  "/rfp/:rfpId",
  passport.authenticate("jwt", { session: false }),
  RFPQuestionController.getByRfp
);

// Update question
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  RFPQuestionController.update
);

// Delete question
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  RFPQuestionController.delete
);

module.exports = router;
