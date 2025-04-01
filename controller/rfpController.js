const RFP = require("../model/rfp");

class RFPController {
  static async create(req, res) {
    try {
      const { description, open_date, close_date, budget } = req.body;
      const userId = req.user.id; // Assuming user info is attached by auth middleware

      const rfp = await RFP.create(
        description,
        open_date,
        close_date,
        budget,
        userId
      );
      res.status(201).json(rfp);
    } catch (error) {
      res.status(500).json({ error: "Failed to create RFP" });
    }
  }

  static async getAll(req, res) {
    try {
      const rfps = await RFP.getAll();
      res.json(rfps);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch RFPs" });
    }
  }

  static async getOne(req, res) {
    try {
      const rfp = await RFP.findById(req.params.id);
      if (!rfp) {
        return res.status(404).json({ error: "RFP not found" });
      }
      res.json(rfp);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch RFP" });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      const updated = await RFP.update(id, updates);
      if (!updated) {
        return res.status(404).json({ error: "RFP not found" });
      }
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to update RFP" });
    }
  }

  static async delete(req, res) {
    try {
      const result = await RFP.delete(req.params.id);
      if (!result) {
        return res.status(404).json({ error: "RFP not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete RFP" });
    }
  }

  static async getMyRFPs(req, res) {
    try {
      const rfps = await RFP.getByUser(req.user.id);
      res.json(rfps);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user RFPs" });
    }
  }
}

module.exports = RFPController;
