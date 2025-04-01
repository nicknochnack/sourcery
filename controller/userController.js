const User = require("../model/user");
const jwt = require("jsonwebtoken");
const { validate, assert } = require("../utilities/utils");
const mailgun = require("mailgun-js")({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});

const userController = {
  async create(req, res) {
    try {
      validate(req.body, ["email", "password", "first_name", "last_name"]);
      const { email, password, first_name, last_name } = req.body;

      const existingUser = await User.findByEmail(email);
      assert(!existingUser, "Email already in use", "email");

      const user = await User.create(email, password, first_name, last_name);
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
      res.json({ user, token });
    } catch (error) {
      console.error("Registration error:", error);
      res
        .status(400)
        .json({ error: error.message, inputError: error.inputError });
    }
  },

  async login(req, res) {
    try {
      validate(req.body, ["email", "password"]);
      const { email, password } = req.body;

      const user = await User.findByEmail(email);
      assert(
        user && (await User.validatePassword(user, password)),
        "Invalid credentials"
      );

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
      res.status(200).json({ user: { id: user.id, email: user.email }, token });
    } catch (error) {
      console.error("Login error:", error);
      res.status(401).json({ error: error.message });
    }
  },

  async me(req, res) {
    res.status(200).json({ user: { id: req.user.id, email: req.user.email } });
  },

  async getAll(req, res) {
    try {
      const users = await User.getAll();
      // Only send necessary user information
      const sanitizedUsers = users.map((user) => ({
        id: user.id,
        email: user.email,
        name: user.name,
      }));
      res.status(200).json(sanitizedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "An error occurred while fetching users" });
    }
  },

  async forgotPassword(req, res) {
    try {
      validate(req.body, ["email"]);
      const { email } = req.body;

      const user = await User.findByEmail(email);
      assert(user, "No user found with this email address");

      if (user) {
        //   Sign new token using existing password as hash
        const resetToken = jwt.sign(
          { timestamp: Date.now(), user_id: user.id },
          user.password,
          {
            expiresIn: 300000,
          }
        );

        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

        const mailData = {
          from: "Your App <noreply@yourdomain.com>",
          to: email,
          subject: "Password Reset",
          text: `Please use the following link to reset your password: ${resetUrl}`,
          html: `<p>Please use the following link to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
        };
        console.log(mailData);
        if (process.env.MAIL_ENABLED == "true") {
          await mailgun.messages().send(mailData);
        }
      }

      res
        .status(200)
        .json({ message: "Please check your email for further instructions." });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(400).json({ error: error.message });
    }
  },

  async resetPassword(req, res) {
    try {
      validate(req.body, ["token", "email", "password"]);
      const { token, email, password } = req.body;

      const user = await User.findByEmail(email);
      assert(user, "Invalid or expired reset token");

      const tokenData = jwt.verify(token, user.password);
      console.log(tokenData);
      // Convert the database timestamp to JavaScript milliseconds
      const resetTokenExpiryMs = new Date(tokenData.exp).getTime();
      const currentTimeMs = Date.now();

      assert(resetTokenExpiryMs < currentTimeMs, "Reset token has expired");

      await User.updatePassword(tokenData.user_id, password);

      res.status(201).json({ message: "Password has been reset successfully" });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(400).json({ error: error.message });
    }
  },
};

module.exports = userController;
