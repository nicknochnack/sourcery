const express = require("express");
const router = express.Router();
const RFPController = require("../controller/rfpController");
const passport = require("passport");

// Create new RFP
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  RFPController.create
);

// Get all RFPs
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  RFPController.getAll
);

// Get my RFPs
router.get(
  "/my-rfps",
  passport.authenticate("jwt", { session: false }),
  RFPController.getMyRFPs
);

// Get specific RFP
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  RFPController.getOne
);

// Update RFP
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  RFPController.update
);

// Delete RFP
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  RFPController.delete
);

module.exports = router;
