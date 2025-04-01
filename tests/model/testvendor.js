const Vendor = require("../../model/vendor");
require("dotenv").config();

(async () => {
  console.log(process.env.DB_PORT);
  const user = await Vendor.create(
    "Global Epoxy Worldwide",
    "Meg",
    "Agrounda",
    "meg.agrounda@gew.com",
    "Global epoxy company, head office in Buffalo."
  );
  console.log(`Created successfully - ${JSON.stringify(user)}`);

  process.exit();
})();

// name,
// contact_first_name,
// contact_last_name,
// contact_email,
// description,
