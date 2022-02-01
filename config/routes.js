const authController = require("../controllers/authController");
const tripController = require("../controllers/tripController");

module.exports = (app) => {
    app.use("/auth", authController);
    app.use("/", tripController);
};