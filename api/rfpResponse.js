const express = require("express");
const router = express.Router();
const RFPResponseController = require("../controller/rfpResponseController");
const passport = require("passport");
const multer = require("multer");

// Configure multer for Excel files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/rfp-responses"); // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      file.mimetype === "application/vnd.ms-excel"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only Excel files are allowed!"));
    }
  },
});

// Create new response
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  RFPResponseController.create
);

// Get responses for specific proposal
router.get(
  "/rfp/:proposalId",
  passport.authenticate("jwt", { session: false }),
  RFPResponseController.getByProposal
);

// Update response
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  RFPResponseController.update
);

// Delete response
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  RFPResponseController.delete
);

// Upload response
router.post(
  "/upload",
  passport.authenticate("jwt", { session: false }),
  upload.single("file"),
  RFPResponseController.upload
);

module.exports = router;
