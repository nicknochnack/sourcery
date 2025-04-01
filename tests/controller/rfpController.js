const rfpController = require("../../controller/rfpController");

(async () => {
  // Test RFP creation
  const req = {
    params: {},
    body: {
      description: "RFP to procure Epoxy Flooring",
      open_date: new Date("2025-03-24").toISOString(),
      close_date: new Date("2025-04-24").toISOString(),
      budget: 3300,
    },
    query: {},
    headers: {},
    user: { id: "a559b216-a1c5-4619-8326-f62b0773e93d" },
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

  const rfp = await rfpController.create(req, res);
  console.log("Response Status:", res.statusCode);
  console.log("Response Body:", res.body);

  process.exit();
})();
