/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable("rfp_response", function (table) {
    table
      .specificType("rfp_question_id", "char(36)")
      .references("id")
      .inTable("rfp_question")
      .onDelete("CASCADE");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable("rfp_response", function (table) {
    table.dropColumn("rfp_question_id");
  });
};
