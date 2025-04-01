const db = require("./knex")();
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

class User {
  static async create(email, password, firstName, lastName) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const [user] = await db("user")
      .insert({
        id: uuidv4(),
        email,
        password: hashedPassword,
        first_name: firstName,
        last_name: lastName,
      })
      .returning("*");
    delete user.password;
    return user;
  }

  static async findByEmail(email) {
    return db("user").where({ email }).first();
  }

  static async findById(id) {
    return db("user").where({ id }).first();
  }

  static async validatePassword(user, password) {
    return bcrypt.compare(password, user.password);
  }

  static async updatePassword(userId, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return await db("user")
      .where({ id: userId })
      .update({ password: hashedPassword });
  }

  static async delete(id) {
    return id ? await db("user").where({ id }).del() : false;
  }

  static async getAll() {
    return db("user")
      .select(
        "id",
        "email",
        "first_name",
        "last_name",
        "date_created",
        "last_active",
        "disabled"
      )
      .orderBy(["last_name", "first_name"]); // Sort by last name, then first name
  }
}

module.exports = User;
