const VendorProposal = require("../model/vendor_proposal");

class VendorProposalController {
  static async create(req, res) {
    try {
      const { rfpId, vendorId } = req.body;
      const proposal = await VendorProposal.create(rfpId, vendorId);
      res.status(201).json(proposal);
    } catch (error) {
      res.status(500).json({ error: "Failed to create proposal" });
    }
  }
  static async get(req, res) {
    try {
      const proposals = await VendorProposal.findById(req.params.proposalId);
      res.json(proposals);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch proposals" });
    }
  }

  static async getByRfp(req, res) {
    try {
      const proposals = await VendorProposal.getByRfp(req.params.rfpId);
      res.json(proposals);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch proposals" });
    }
  }

  static async getByVendor(req, res) {
    try {
      const proposals = await VendorProposal.getByVendor(req.params.vendorId);
      res.json(proposals);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch vendor proposals" });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      const updated = await VendorProposal.update(id, updates);
      if (!updated) {
        return res.status(404).json({ error: "Proposal not found" });
      }
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to update proposal" });
    }
  }

  static async delete(req, res) {
    try {
      const result = await VendorProposal.delete(req.params.id);
      if (!result) {
        return res.status(404).json({ error: "Proposal not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting proposal:", error);
      res.status(500).json({
        error: "Failed to delete proposal",
        details: error.message,
      });
    }
  }
}

module.exports = VendorProposalController;
