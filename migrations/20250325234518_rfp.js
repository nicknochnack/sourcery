/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("rfp", (table) => {
    table.specificType("id", "char(36)").primary();
    table.text("description", "longtext").notNullable();
    table.timestamp("open_date").notNullable();
    table.timestamp("close_date").notNullable();
    table.float("budget").notNullable();
    table.timestamp("date_created").defaultTo(knex.fn.now());
    table.timestamp("last_updated").defaultTo(knex.fn.now());
    table.string("status").defaultTo("open");
    table
      .specificType("created_by", "char(36)")
      .references("id")
      .inTable("user")
      .onDelete("CASCADE");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("rfp");
};
