const Vendor = require("../model/vendor");

class VendorController {
  static async create(req, res) {
    try {
      const {
        name,
        contact_first_name,
        contact_last_name,
        contact_email,
        description,
      } = req.body;
      const vendor = await Vendor.create(
        name,
        contact_first_name,
        contact_last_name,
        contact_email,
        description
      );
      res.status(201).json(vendor);
    } catch (error) {
      res.status(500).json({ error: "Failed to create vendor" });
    }
  }

  static async getAll(req, res) {
    try {
      const vendors = await Vendor.getAll();
      res.json(vendors);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch vendors" });
    }
  }

  static async getOne(req, res) {
    try {
      const vendor = await Vendor.findById(req.params.id);
      if (!vendor) {
        return res.status(404).json({ error: "Vendor not found" });
      }
      res.json(vendor);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch vendor" });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      const updated = await Vendor.update(id, updates);
      if (!updated) {
        return res.status(404).json({ error: "Vendor not found" });
      }
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to update vendor" });
    }
  }

  static async delete(req, res) {
    try {
      const result = await Vendor.delete(req.params.id);
      if (!result) {
        return res.status(404).json({ error: "Vendor not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete vendor" });
    }
  }
}

module.exports = VendorController;
