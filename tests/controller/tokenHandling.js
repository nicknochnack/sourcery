const jsonwebtoken = require("jsonwebtoken");
(() => {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aW1lc3RhbXAiOjE3MzY3MjQ3MjM1MzcsInVzZXJfaWQiOiIwMmU4ZWE3YS00NDU3LTQ1YjAtOWE4YS0yZmRiNDNlZTI5YjgiLCJpYXQiOjE3MzY3MjQ3MjMsImV4cCI6MTczNjcyNTAyM30.4swBoD3E21Byxe-LpocZf4dXkLGbRkW3tyH2lTrmyOE";
  const hash = "$2b$10$3jTC6AyI3vEPZF1HD7dqEessNGFGfSa.VZ28ZRAJVEF3GHOj7v.H6";

  console.log(jsonwebtoken.verify(token, hash));
})();
