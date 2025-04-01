const RFPResponse = require("../../model/rfp_response");
require("dotenv").config();

(async () => {
  console.log(process.env.DB_PORT);
  const user = await RFPResponse.getByProposal(
    "c77304f6-d13b-4ef7-99c7-19c25d3fcb2b"
  );
  console.log(`Got response detail successfully - ${JSON.stringify(user)}`);

  process.exit();
})();
