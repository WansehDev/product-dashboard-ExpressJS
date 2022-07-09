const Express = require("express");
const session = require("express-session");
const Router = Express.Router();
const UserController = require("./controllers/UserController");
const AdminController = require("./controllers/AdminController");

Router.use(
  session({
    secret: "keyboardkitteh",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);

Router.use((req, res, next) => {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");

  next();
});

/* USER LOGIN ROUTE */
Router.get("/", UserController.indexPage);
Router.post("/users/validate", UserController.validateLogin);

/* USER LOGOUT ROUTE */
Router.get("/user/logoff", UserController.logoff);

/* USER REGISTER ROUTE */
Router.get("/register", UserController.registerPage);
Router.post("/register/validate", UserController.validateRegister);

/* USER(NONADMIN) DASHBOARD ROUTE */
Router.get("/dashboard", UserController.dashboardPage);

/* USER(ADMIN) DASHBOARD ROUTE AND CRUD */
Router.get("/adminDashboard", UserController.adminDashboardPage);

Router.get("/admin/create", AdminController.createProductPage);
Router.post("/product/add", AdminController.addProduct);

Router.get("/edit/:id", AdminController.editProductPage);
Router.post("/save/:id", AdminController.updateProduct);

Router.get("/remove/:id", AdminController.removeProductPage);
Router.get("/admin/delete/:id", AdminController.confirmDeleteProduct);

/* ALL USER PROFILE ROUTE */
Router.get("/profile", UserController.profilePage);
Router.post("/profile/information", UserController.updateProfile);
Router.post("/profile/password", UserController.updatePassword);

/* USER ITEM ROUTE */
Router.get("/product/show/:id", UserController.itemPage);
Router.post("/product/addReview/:id", UserController.addReview);
Router.post("/product/addComment/:id", UserController.addComment);

module.exports = Router;
