const db = require("./knex")();
const { v4: uuidv4 } = require("uuid");

class Approval {
  static async create(title, description, createdBy, assignedTo) {
    const [approval] = await db("approval")
      .insert({
        id: uuidv4(),
        title,
        description,
        created_by: createdBy,
        assigned_to: assignedTo,
        status: "pending",
      })
      .returning("*");
    return approval;
  }

  static async findById(id) {
    return db("approval").where({ id }).first();
  }

  static async getByAssignee(userId) {
    return db("approval")
      .where({ assigned_to: userId })
      .orderBy("date_created", "desc");
  }

  static async getByCreator(userId) {
    return db("approval")
      .where({ created_by: userId })
      .orderBy("date_created", "desc");
  }

  static async update(id, updates) {
    const [updated] = await db("approval")
      .where({ id })
      .update({
        ...updates,
        last_updated: db.fn.now(),
      })
      .returning("*");
    return updated;
  }

  static async approve(id, comments) {
    return this.update(id, {
      status: "approved",
      comments,
      approved_at: db.fn.now(),
    });
  }

  static async reject(id, comments) {
    return this.update(id, {
      status: "rejected",
      comments,
      approved_at: db.fn.now(),
    });
  }

  static async delete(id) {
    return id ? await db("approval").where({ id }).del() : false;
  }
}

module.exports = Approval;
