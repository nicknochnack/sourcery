const watsonxController = require("../../controller/watsonxController");

(async () => {
  // Test user creation
  const req = {
    params: {},
    body: { proposalId: "9f081a49-0d3d-49b3-b8a8-597abbe2f39b" },
    query: {},
    headers: {},
  };

  // Mock response object with common Express.js methods
  const res = {
    status: function (code) {
      this.statusCode = code;
      return this;
    },
    json: function (data) {
      this.body = data;
      return this;
    },
    send: function (data) {
      this.body = data;
      return this;
    },
  };

  const patient = await watsonxController.summariseResponse(req, res);
  console.log("Response Status:", res.statusCode);
  console.log("Response Body:", res.body);
  process.exit();
})();
