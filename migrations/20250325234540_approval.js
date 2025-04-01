/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("approval", function (table) {
    table.specificType("id", "char(36)").primary();
    table
      .specificType("rfp_id", "char(36)")
      .references("id")
      .inTable("rfp")
      .onDelete("CASCADE");
    table.string("status").defaultTo("pending");
    table
      .specificType("created_by", "char(36)")
      .references("id")
      .inTable("user")
      .onDelete("CASCADE");
    table
      .specificType("assigned_to", "char(36)")
      .references("id")
      .inTable("user")
      .onDelete("CASCADE");
    table.timestamp("approved_at");
    table.text("comments");
    table.timestamp("date_created").defaultTo(knex.fn.now());
    table.timestamp("last_updated").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("approval");
};
