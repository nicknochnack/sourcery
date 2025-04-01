const Approval = require("../model/approval");

class ApprovalController {
  static async create(req, res) {
    try {
      const { title, description, assignedTo } = req.body;
      const createdBy = req.user.id;
      const approval = await Approval.create(
        title,
        description,
        createdBy,
        assignedTo
      );
      res.status(201).json(approval);
    } catch (error) {
      res.status(500).json({ error: "Failed to create approval request" });
    }
  }

  static async getMyApprovals(req, res) {
    try {
      const approvals = await Approval.getByAssignee(req.user.id);
      res.json(approvals);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch approvals" });
    }
  }

  static async getMyRequests(req, res) {
    try {
      const approvals = await Approval.getByCreator(req.user.id);
      res.json(approvals);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch approval requests" });
    }
  }

  static async approve(req, res) {
    try {
      const { id } = req.params;
      const { comments } = req.body;
      const approval = await Approval.approve(id, comments);
      if (!approval) {
        return res.status(404).json({ error: "Approval request not found" });
      }
      res.json(approval);
    } catch (error) {
      res.status(500).json({ error: "Failed to approve request" });
    }
  }

  static async reject(req, res) {
    try {
      const { id } = req.params;
      const { comments } = req.body;
      const approval = await Approval.reject(id, comments);
      if (!approval) {
        return res.status(404).json({ error: "Approval request not found" });
      }
      res.json(approval);
    } catch (error) {
      res.status(500).json({ error: "Failed to reject request" });
    }
  }

  static async delete(req, res) {
    try {
      const result = await Approval.delete(req.params.id);
      if (!result) {
        return res.status(404).json({ error: "Approval request not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete approval request" });
    }
  }
}

module.exports = ApprovalController;
