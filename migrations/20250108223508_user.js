exports.up = function (knex) {
  return knex.schema.createTable("user", (table) => {
    table.specificType("id", "char(36)").primary();
    table.string("email").notNullable().unique();
    table.string("password").notNullable();
    table.string("first_name").notNullable();
    table.string("last_name").notNullable();
    table.timestamp("date_created").defaultTo(knex.fn.now());
    table.timestamp("last_active").defaultTo(knex.fn.now());
    table.bool("disabled").notNullable().defaultTo(false);
    //   table
    //     .specificType("location_id", "char(36)")
    //     .references("id")
    //     .inTable("location")
    //     .onDelete("CASCADE");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("user");
};
