/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("rfp_response", (table) => {
    table.specificType("id", "char(36)").primary();
    table.text("description", "longtext").notNullable();
    table
      .specificType("vendor_proposal_id", "char(36)")
      .references("id")
      .inTable("vendor_proposal")
      .onDelete("CASCADE");
    table.timestamp("date_created").defaultTo(knex.fn.now());
    table.timestamp("last_updated").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("rfp_response");
};
