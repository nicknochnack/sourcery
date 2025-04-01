const Knex = require("knex");
const KnexFile = require("../knexfile")[process.env.NODE_ENV || "development"];

module.exports = (settings) => {
  if (!settings) settings = KnexFile;
  return new Knex(settings);
};
