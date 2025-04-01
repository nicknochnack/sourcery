const db = require("./knex")();
const { v4: uuidv4 } = require("uuid");

class RFPResponse {
  static async create(questionId, proposalId, response, complies) {
    const [rfpResponse] = await db("rfp_response")
      .insert({
        id: uuidv4(),
        description: response,
        rfp_question_id: questionId,
        vendor_proposal_id: proposalId,
        complies,
      })
      .returning("*");
    return rfpResponse;
  }

  static async findById(id) {
    return db("rfp_response").where({ id }).first();
  }

  static async getByProposal(proposalId) {
    return (
      db("rfp_response")
        .where({ vendor_proposal_id: proposalId })
        .join("rfp_question", "rfp_response.rfp_question_id", "rfp_question.id")
        .select(
          "rfp_response.id",
          "rfp_response.description as response",
          "rfp_response.complies",
          "rfp_response.date_created",
          "rfp_question.id as question_id",
          "rfp_question.description"
        )
        // .orderBy("rfp_question.section")
        .orderBy("rfp_response.date_created", "asc")
    );
  }

  static async update(id, updates) {
    const [updated] = await db("rfp_response")
      .where({ id })
      .update(updates)
      .returning("*");
    return updated;
  }

  static async delete(id) {
    return id ? await db("rfp_response").where({ id }).del() : false;
  }
}

module.exports = RFPResponse;
