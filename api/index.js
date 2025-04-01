const express = require("express");
const router = express.Router();
const userRoutes = require("./user");
const watsonxRoutes = require("./watsonx");
const rfpRoutes = require("./rfp");
const vendorRoutes = require("./vendor");
const rfpQuestionRoutes = require("./rfpQuestion");
const vendorProposalRoutes = require("./vendorProposal");
const rfpResponseRoutes = require("./rfpResponse");
const approvalRoutes = require("./approval");

router.use("/user", userRoutes);
router.use("/watsonx", watsonxRoutes);
router.use("/rfp", rfpRoutes);
router.use("/vendor", vendorRoutes);
router.use("/rfpQuestion", rfpQuestionRoutes);
router.use("/vendorProposal", vendorProposalRoutes);
router.use("/rfpResponse", rfpResponseRoutes);
router.use("/approval", approvalRoutes);

module.exports = router;
