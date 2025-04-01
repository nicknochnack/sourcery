const axios = require("axios");

const baseUrl = "http://localhost:8080/api";

(async () => {
  const res = await axios.post(
    `${baseUrl}/rfp`,
    {
      description:
        "I need an RFP to procure epoxy flooring for a site that is 30 sqm in size. ",
      open_date: new Date("2025-03-24").toISOString(),
      close_date: new Date("2025-04-24").toISOString(),
      budget: 3300,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImE1NTliMjE2LWExYzUtNDYxOS04MzI2LWY2MmIwNzczZTkzZCIsImlhdCI6MTc0Mjk1MzQwMn0.pRkWoKTygLGCYAeiV3xNts3olDbaGgPiT8bVMBwkOac",
      },
    }
  );
  console.log(res.data);
  process.exit();
})();
