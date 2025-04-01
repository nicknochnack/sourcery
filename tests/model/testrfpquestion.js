const RFPQuestion = require("../../model/rfp_question");
require("dotenv").config();

(async () => {
  console.log(process.env.DB_PORT);
  const user = await RFPQuestion.create(
    "fb180fc0-039a-4d32-ad04-1cfe4759e9a4",
    "What is the process for handling any potential issues or defects that may arise during or after the project completion?",
    new Date("2025-03-24").toISOString(),
    new Date("2025-04-24").toISOString()
  );
  console.log(`Created successfully - ${JSON.stringify(user)}`);

  process.exit();
})();
