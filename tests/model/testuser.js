const User = require("../../model/user");
require("dotenv").config();

(async () => {
  console.log(process.env.DB_PORT);
  const password = "abc123";
  // const password2 = "test123";
  const user = await User.create("user@gmail.com", password, "Jack", "TheUser");
  console.log(`Created successfully - ${JSON.stringify(user)}`);

  // const emailUser = await User.findByEmail(user.email);
  // console.log(`User found by email  - ${JSON.stringify(emailUser)}`);

  // const idUser = await User.findById(user.id);
  // console.log(`User found by id - ${JSON.stringify(idUser)}`);

  // const validatePassword = await User.validatePassword(user, password);
  // console.log(`Password validated -  ${JSON.stringify(validatePassword)}`);

  // const updatePassword = await User.updatePassword(user.id, password2);
  // console.log(`Updated password - ${JSON.stringify(updatePassword)}`);

  // const validatePassword2 = await User.validatePassword(user, password2);
  // console.log(
  //   `Password validated after update -  ${JSON.stringify(validatePassword2)}`
  // );

  // const deleted = await User.delete(user.id);
  // console.log(`User deleted - ${JSON.stringify(deleted)}`);
  process.exit();
})();
