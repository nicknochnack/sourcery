const db = require("./knex")();
const { v4: uuidv4 } = require("uuid");

class RFP {
  static async create(description, open_date, close_date, budget, userId) {
    const [rfp] = await db("rfp")
      .insert({
        id: uuidv4(),
        description,
        open_date,
        close_date,
        budget,
        created_by: userId,
        status: "draft",
      })
      .returning("*");
    return rfp;
  }

  static async findById(id) {
    return db("rfp").where({ id }).first();
  }

  static async update(id, updates) {
    const [updated] = await db("rfp")
      .where({ id })
      .update(updates)
      .returning("*");
    return updated;
  }

  static async delete(id) {
    return id ? await db("rfp").where({ id }).del() : false;
  }

  static async getAll() {
    return db("rfp").select("*").orderBy("date_created", "desc");
  }

  static async getByUser(userId) {
    return db("rfp")
      .where({ created_by: userId })
      .orderBy("date_created", "desc");
  }
}

module.exports = RFP;
