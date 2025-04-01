const axios = require("axios");

const baseUrl = "http://localhost:8080/api";

(async () => {
  const res = await axios.post(`${baseUrl}/user/register`, {
    email: "booyaka@gmail.com",
    password: "blamo123",
    first_name: "nick",
    last_name: "renotte",
  });
  console.log(res);
  process.exit();
})();
