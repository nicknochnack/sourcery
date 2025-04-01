const db = require("./knex")();
const { v4: uuidv4 } = require("uuid");

class Vendor {
  static async create(
    name,
    contact_first_name,
    contact_last_name,
    contact_email,
    description
  ) {
    const [vendor] = await db("vendor")
      .insert({
        id: uuidv4(),
        name,
        contact_first_name,
        contact_last_name,
        contact_email,
        description,
      })
      .returning("*");
    return vendor;
  }

  static async findById(id) {
    return db("vendor").where({ id }).first();
  }

  static async update(id, updates) {
    const [updated] = await db("vendor")
      .where({ id })
      .update(updates)
      .returning("*");
    return updated;
  }

  static async delete(id) {
    return id ? await db("vendor").where({ id }).del() : false;
  }

  static async getAll() {
    return db("vendor").select("*").orderBy("name", "asc");
  }
}

module.exports = Vendor;
