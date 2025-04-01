/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable("vendor_proposal", function (table) {
    table
      .specificType("vendor_id", "char(36)")
      .notNullable()
      .references("id")
      .inTable("vendor")
      .onDelete("CASCADE");

    table
      .specificType("rfp_id", "char(36)")
      .notNullable()
      .references("id")
      .inTable("rfp")
      .onDelete("CASCADE");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable("vendor_proposal", function (table) {
    table.dropColumn("vendor_id");
    table.dropColumn("rfp_id");
  });
};
