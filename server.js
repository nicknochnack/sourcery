require("dotenv").config();
const express = require("express");
const config = require("config");
const helmet = require("helmet");
const passport = require("./utilities/passport");
const cors = require("cors");
const path = require("path");
const throttle = config.get("throttle");
const limiter = require("express-rate-limit");
const port = process.env.PORT || 8080;
const api = require("./api");

// Create server
const app = express();

// Use helmet to set content security policy
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'"],
        frameSrc: ["'self'"],
        childSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: [
          "'self'",
          "https://i.vimeocdn.com",
          "https://i.ytimg.com",
          "https://via.placeholder.com",
          "https://placehold.co",
          "http://www.w3.org/2000/svg",
          "data:",
        ],
        baseUri: ["'self'"],
      },
    },
  })
);

// CORS to allow Vimeo, YouTube, and other verified origins
const opts = {
  origin: [process.env.CLIENT_URL, process.env.DOMAIN],
};
app.use(cors(opts));
app.options("*", cors(opts));

// Global error handling
app.use(function (err, req, res, next) {
  const message = err.raw?.message || err.message || err.sqlMessage || null;
  console.log(err);
  return res.status(500).send({ message: message });
});
// Parse JSON bodies
app.use(express.json());
// Allow processing of the body
app.use(express.urlencoded({ extended: true }));
app.set("trust proxy", 1); // rate limiter proxy

// Import API
if (process.env.THROTTLE_ENABLED == "true") {
  app.use("/api", limiter(throttle.api));
}
app.use("/api", api);

// Use Passport
app.use(express.json());
app.use(passport.initialize());

// Point to static build if in staging or production
if (
  process.env.NODE_ENV === "staging" ||
  process.env.NODE_ENV === "production"
) {
  app.use(express.static(path.join(__dirname, "client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "/client/build/index.html"));
  });
}

app.listen(port, () => {
  console.log(`Console log server listening on port ${port}`);
});

module.exports = app;
