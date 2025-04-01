const RFPQuestion = require("../model/rfp_question");
const chalk = require("chalk");

class RFPQuestionController {
  static async create(req, res) {
    try {
      const { rfpId, question, required } = req.body;
      const rfpQuestion = await RFPQuestion.create(rfpId, question, required);
      res.status(201).json(rfpQuestion);
    } catch (error) {
      res.status(500).json({ error: "Failed to create RFP question" });
    }
  }

  static async getByRfp(req, res) {
    try {
      const questions = await RFPQuestion.getByRfp(req.params.rfpId);
      res.json(questions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch RFP questions" });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      console.log(chalk.blueBright(JSON.stringify(updates)));
      const updated = await RFPQuestion.update(id, updates);
      if (!updated) {
        return res.status(404).json({ error: "Question not found" });
      }
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to update question" });
    }
  }

  static async delete(req, res) {
    try {
      const result = await RFPQuestion.delete(req.params.id);
      if (!result) {
        return res.status(404).json({ error: "Question not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete question" });
    }
  }
}

module.exports = RFPQuestionController;
