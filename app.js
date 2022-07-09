const Express = require("express");
session = require("express-session");
PATH = require("path");
PORT = process.env.PORT || 3000;
bodyParser = require("body-parser");
router = require("./routes");

const app = Express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(Express.static(PATH.join(__dirname, "./static")));
// app.use((req, res, next) => {
//   if (typeof req.session.userDetails == "undefined") {
//     res.redirect("/");
//   } else {
//     next();
//   }
// });

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use("/", router);

app.listen(PORT, console.log("Server don start on port " + PORT));
