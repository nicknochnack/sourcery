const userController = require("../../controller/userController");

(async () => {
  // Test user creation
  const req = {
    params: {},
    body: {
      email: "nick@gmail.com",
      password: "abc123",
      first_name: "nick",
      last_name: "renotte",
    },
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

  const patient = await userController.create(req, res);
  console.log("Response Status:", res.statusCode);
  console.log("Response Body:", res.body);

  // // Test Login
  // const req2 = {
  //   params: {},
  //   body: {
  //     email: "nick@gmail.com",
  //     password: "abc123",
  //   },
  //   query: {},
  //   headers: {},
  // };

  // //   const createdPatient = await userController.login(req2, res);
  // //   console.log("Response Status:", res.statusCode);
  // //   console.log("Response Body:", res.body);

  // // Test me - assumes user and email are attached to req during auth
  // const req3 = {
  //   params: {},
  //   body: {},
  //   query: {},
  //   headers: {},
  //   user: {
  //     id: "02e8ea7a-4457-45b0-9a8a-2fdb43ee29b8",
  //     email: "nick@gmail.com",
  //   },
  // };

  // //   const updatedPatient = await userController.me(req3, res);
  // //   console.log("Response Status:", res.statusCode);
  // //   console.log("Response Body:", res.body);

  // // Test Forgot Password Request
  // const req4 = {
  //   params: {},
  //   body: { email: "nick@gmail.com" },
  //   query: {},
  //   headers: {},
  // };

  // //   const forgottenPassword = await userController.forgotPassword(req4, res);
  // //   console.log("Response Status:", res.statusCode);
  // //   console.log("Response Body:", res.body);

  // // Test Reset Password Request
  // const req5 = {
  //   params: {},
  //   body: {
  //     token:
  //       "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lc3RhbXAiOjE3MzY3MjU1OTA4NjEsInVzZXJfaWQiOiIwMmU4ZWE3YS00NDU3LTQ1YjAtOWE4YS0yZmRiNDNlZTI5YjgiLCJpYXQiOjE3MzY3MjU1OTAsImV4cCI6MTczNzAyNTU5MH0.rSEyKO1i6zw9I700AGCFP8XSfX4mJiCAaROo5xTkBbI",
  //     email: "nick@gmail.com",
  //     password: "lkjkljlkjlkj123",
  //   },
  //   query: {},
  //   headers: {},
  // };

  // const resetPassword = await userController.resetPassword(req5, res);
  // console.log("Response Status:", res.statusCode);
  // console.log("Response Body:", res.body);

  process.exit();
})();
