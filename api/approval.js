const express = require("express");
const router = express.Router();
const ApprovalController = require("../controller/approvalController");
const passport = require("passport");

// Create new approval request
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  ApprovalController.create
);

// Get approvals assigned to me
router.get(
  "/my-approvals",
  passport.authenticate("jwt", { session: false }),
  ApprovalController.getMyApprovals
);

// Get approval requests I created
router.get(
  "/my-requests",
  passport.authenticate("jwt", { session: false }),
  ApprovalController.getMyRequests
);

// Approve a request
router.post(
  "/:id/approve",
  passport.authenticate("jwt", { session: false }),
  ApprovalController.approve
);

// Reject a request
router.post(
  "/:id/reject",
  passport.authenticate("jwt", { session: false }),
  ApprovalController.reject
);

// Delete approval request
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  ApprovalController.delete
);

module.exports = router;
