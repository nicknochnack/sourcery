const db = require("./knex")();
const { v4: uuidv4 } = require("uuid");

class RFPQuestion {
  static async create(rfpId, description, date_created, last_updated) {
    const [rfpQuestion] = await db("rfp_question")
      .insert({
        id: uuidv4(),
        rfp_id: rfpId,
        description,
        date_created,
        last_updated,
      })
      .returning("*");
    return rfpQuestion;
  }

  static async findById(id) {
    return db("rfp_question").where({ id }).first();
  }

  static async getByRfp(rfpId) {
    return db("rfp_question")
      .where({ rfp_id: rfpId })
      .orderBy("date_created", "asc");
  }

  static async update(id, updates) {
    const [updated] = await db("rfp_question")
      .where({ id })
      .update(updates)
      .returning("*");
    return updated;
  }

  static async delete(id) {
    return id ? await db("rfp_question").where({ id }).del() : false;
  }
}

module.exports = RFPQuestion;
