const RFPResponse = require("../model/rfp_response");
const xlsx = require("xlsx");
const fs = require("fs");
const VendorProposal = require("../model/vendor_proposal");
const chalk = require("chalk");

class RFPResponseController {
  static async create(req, res) {
    try {
      const { questionId, proposalId, response } = req.body;
      const rfpResponse = await RFPResponse.create(
        questionId,
        proposalId,
        response
      );
      res.status(201).json(rfpResponse);
    } catch (error) {
      res.status(500).json({ error: "Failed to create response" });
    }
  }

  static async getByProposal(req, res) {
    try {
      const responses = await RFPResponse.getByProposal(req.params.proposalId);
      res.json(responses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch responses" });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      const updated = await RFPResponse.update(id, updates);
      if (!updated) {
        return res.status(404).json({ error: "Response not found" });
      }
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to update response" });
    }
  }

  static async delete(req, res) {
    try {
      const result = await RFPResponse.delete(req.params.id);
      if (!result) {
        return res.status(404).json({ error: "Response not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete response" });
    }
  }

  static async upload(req, res) {
    try {
      if (!req.file || !req.body.rfpId || !req.body.vendorId) {
        return res.status(400).json({
          success: false,
          message: "File, RFP ID and Vendor ID are required",
        });
      }

      // 1. Create a new vendor proposal
      const proposal = await VendorProposal.create(
        req.body.rfpId,
        req.body.vendorId
      );

      // 2. Read the Excel file
      const workbook = xlsx.readFile(req.file.path);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = xlsx.utils.sheet_to_json(worksheet);

      // 3. Create RFP responses for each question
      const responses = [];
      for (const row of data) {
        // Skip if Question ID or Response is empty/null/undefined
        if (
          !row["Question ID"] ||
          !row.Response ||
          row.Response.trim() === ""
        ) {
          console.log(
            chalk.yellow(
              `Skipping empty response for question ${row["Question ID"]}`
            )
          );
          continue;
        }

        console.log(chalk.bgCyan(`${row["Question ID"]} - ${row.Response}`));

        const complies = row.Complies
          ? row.Complies.toString().toLowerCase().trim() === "yes"
            ? 1
            : 0
          : 0;

        const response = await RFPResponse.create(
          row["Question ID"],
          proposal.id,
          row.Response,
          complies
        );
        responses.push(response);
      }

      // Clean up the uploaded file after processing
      fs.unlinkSync(req.file.path);

      res.status(201).json({
        success: true,
        message: "RFP response uploaded successfully",
        data: {
          proposalId: proposal.id,
          responses: responses,
          submittedAt: new Date(),
        },
      });
    } catch (error) {
      console.error("Error uploading RFP response:", error);

      // Clean up the uploaded file in case of error
      if (req.file && req.file.path) {
        fs.unlinkSync(req.file.path);
      }

      res.status(500).json({
        success: false,
        message: "Failed to upload RFP response",
        error: error.message,
      });
    }
  }
}

module.exports = RFPResponseController;
