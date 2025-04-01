const express = require("express");
const router = express.Router();
const VendorController = require("../controller/vendorController");
const passport = require("passport");

// Create new vendor
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  VendorController.create
);

// Get all vendors
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  VendorController.getAll
);

// Get specific vendor
router.get(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  VendorController.getOne
);

// Update vendor
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  VendorController.update
);

// Delete vendor
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  VendorController.delete
);

module.exports = router;
