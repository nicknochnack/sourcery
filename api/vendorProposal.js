const express = require("express");
const router = express.Router();
const VendorProposalController = require("../controller/vendorProposalController");
const passport = require("passport");

// Create new proposal
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  VendorProposalController.create
);

router.get(
  "/:proposalId",
  passport.authenticate("jwt", { session: false }),
  VendorProposalController.get
);

// Get proposals for specific RFP
router.get(
  "/rfp/:rfpId",
  passport.authenticate("jwt", { session: false }),
  VendorProposalController.getByRfp
);

// Get proposals for specific vendor
router.get(
  "/vendor/:vendorId",
  passport.authenticate("jwt", { session: false }),
  VendorProposalController.getByVendor
);

// Update proposal
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  VendorProposalController.update
);

// Delete proposal
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  VendorProposalController.delete
);

module.exports = router;
