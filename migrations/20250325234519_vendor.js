/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("vendor", (table) => {
    table.specificType("id", "char(36)").primary();
    table.text("name").notNullable();
    table.text("contact_first_name").notNullable();
    table.text("contact_last_name").notNullable();
    table.text("contact_email").notNullable();
    table.text("description").notNullable();
    table.timestamp("date_created").defaultTo(knex.fn.now());
    table.timestamp("last_updated").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("vendor");
};
