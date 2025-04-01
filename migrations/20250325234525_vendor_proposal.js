/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("vendor_proposal", (table) => {
    table.specificType("id", "char(36)").primary();
    table.text("description");
    table.text("rfp_response");
    table.text("proposal_response");
    table.timestamp("date_created").defaultTo(knex.fn.now());
    table.timestamp("last_updated").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("vendor_proposal");
};
