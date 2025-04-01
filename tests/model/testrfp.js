const RFP = require("../../model/rfp");
require("dotenv").config();

(async () => {
  console.log(process.env.DB_PORT);
  const user = await RFP.create(
    "RFP to procure Epoxy Flooring",
    new Date("2025-03-24").toISOString(),
    new Date("2025-04-24").toISOString(),
    3300,
    "a559b216-a1c5-4619-8326-f62b0773e93d"
  );
  console.log(`Created successfully - ${JSON.stringify(user)}`);

  process.exit();
})();
