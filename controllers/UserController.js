/*
 *   This is a controller class for the users.
 *   @Author: Lance Parantar
 */
// const StudentModel = require("../models/StudentModel");
const UserModel = require("../models/UserModel");
const ProductModel = require("../models/ProductModel");
const ReviewModel = require("../models/ReviewModel");
const CommentModel = require("../models/CommentModel");

const Validator = require("../system/utils/validator");
const bcrypt = require("bcryptjs");
const moment = require("moment");
const e = require("express");

const saltRounds = 10;

function getTimeDiff(date) {
  return moment(date).fromNow();
}

class UserController {
  /*  
  DOCU: This function is triggered by default which displays the default page. Also for rendering Login EJS
  */
  indexPage(req, res) {
    if (req.session.login) {
      return req.session.userDetails.isAdmin == 1
        ? res.redirect("/adminDashboard")
        : res.redirect("/dashboard");
    } else {
      res.render("./user/login", {
        success: req.session.success,
        errors: req.session.errors,
      });
    }
  }

  /*  
   DOCU: This function is triggered when the user clicks the register button. Also for rendering Register EJS
  */
  registerPage(req, res) {
    res.render("./user/register", {
      success: req.session.success,
      errors: req.session.errors,
    });
  }

  /*  
  DOCU: This function is triggered when a non admin
  user clicks the login button and proceeds to user dashboard. 
  */
  async dashboardPage(req, res) {
    // Get all products
    if (req.session.login) {
      let products = await ProductModel.getAllProducts();
      res.render("./user/dashboard", {
        user: req.session.userDetails,
        products: products,
      });
    } else {
      res.redirect("/");
    }
  }

  /*  
  DOCU: This function is triggered when an admin
  user clicks the login button and proceeds to admin user dashboard. 
  */
  async adminDashboardPage(req, res) {
    if (req.session.login) {
      //get all the admins product
      let products = await ProductModel.getAllProducts();
      res.render("./admin/dashboard", {
        user: req.session.userDetails,
        products: products,
      });
    } else {
      res.redirect("/");
    }
  }

  /*  
  DOCU: This function is triggered when the user clicks the profile 
  */
  async profilePage(req, res) {
    if (req.session.login) {
      let userInfo = await UserModel.getUserById(req.session.userDetails.id);
      res.render("./user/profile", {
        user: req.session.userDetails,
        userInfo: userInfo[0],
        success: req.session.success,
        errors: req.session.errors,
      });
    } else {
      res.redirect("/");
    }
  }

  /*
  DOCU: This function is triggered when the user clicks the logout button.
  */

  logoff(req, res) {
    req.session.destroy();
    res.redirect("/");
  }

  /*
  DOCU: Validate Register 
  */

  validateRegister(req, res) {
    let validator = new Validator();
    //validate user input
    for (let key in req.body) {
      validator.validateFields(key, req.body[key]);

      //validate email
      if (key == "email") {
        validator.isEmail(key, req.body[key]);
      }
    }

    if (validator.isErrorFree()) {
      if (req.body.password == req.body.confirm_password) {
        // encrypt password by generating a salt and hashing them
        bcrypt.genSalt(saltRounds, (err, salt) => {
          if (err) throw err;
          bcrypt.hash(req.body.password, salt, (err, hash) => {
            if (err) throw err;
            UserModel.createUser(req.body, { salt, hash });
          });
        });

        req.session.success = "User Created";
      } else {
        validator.createOwnError("Password is not the same.");
      }
    }

    if (validator.getErrors()) {
      req.session.errors = validator.getErrors();
    }

    res.redirect("/register");
  }

  /*  
  DOCU: This function is triggered when the sign in button is clicked. 

  This validates the required form inputs and if user password matches in the database by given email.If no problem occured, user will be routed to the dashboard page.
  */

  async validateLogin(req, res) {
    let validate = new Validator();

    for (let key in req.body) {
      validate.validateFields(key, req.body[key]);

      //validate email
      if (key == "email") {
        validate.isEmail(key, req.body[key]);
      }
    }

    // if validation is not successfull
    // redirect to indexPage
    // else

    if (validate.isErrorFree()) {
      // get the email of the user
      let user = await UserModel.getUserByEmail(req.body.email);
      // if user is found
      if (user.length > 0) {
        // compare the password
        bcrypt.compare(req.body.password, user[0].password, (err, isMatch) => {
          if (err) throw err;

          if (isMatch) {
            req.session.userDetails = {
              id: user[0].id,
              isAdmin: user[0].is_admin,
            };
            req.session.login = true;
            //check wether the user is admin or not
            return user[0].is_admin == 1
              ? res.redirect("/adminDashboard")
              : res.redirect("/dashboard");
          } else {
            validate.createOwnError("Email or password is incorrect.");
            req.session.errors = validate.getErrors();
            res.redirect("/");
          }
        });
      } else {
        validate.createOwnError("Email or password is incorrect.");
      }
    }

    if (validate.getErrors()) {
      req.session.errors = validate.getErrors();
      res.redirect("/");
    }
  }

  /* DOCU: This function is triggered when the user clicks the save in profile. */
  async updateProfile(req, res) {
    let result = await UserModel.saveProfile(
      req.body,
      req.session.userDetails.id
    );
    console.log(result);
    if (result.changedRows > 0) {
      req.session.success = "Profile Updated";
    }
    res.redirect("/profile");
  }

  /* DOCU: This function is triggered when the user clicks the save in profile Password. */
  async updatePassword(req, res) {
    let userOldPassword = await UserModel.getOldPassword(
      req.session.userDetails.id
    );

    bcrypt.compare(
      req.body.old_password,
      userOldPassword[0].password,
      (err, isMatch) => {
        if (err) throw err;

        if (isMatch) {
          bcrypt.genSalt(saltRounds, (err, salt) => {
            if (err) throw err;
            bcrypt.hash(req.body.new_password, salt, (err, hash) => {
              if (err) throw err;
              UserModel.savePassword(
                { salt, hash },
                req.session.userDetails.id
              );
            });
          });
          req.session.success = "Password Updated";
        } else {
          req.session.errors = "Old Password is incorrect";
        }
      }
    );
    res.redirect("/profile");
  }

  // ITEM PAGE
  async itemPage(req, res) {
    let productInfo = await ProductModel.getProductById(req.params.id);

    // format date
    productInfo[0].created_at = moment(productInfo[0].created_at).format(
      "MMMM Do YYYY"
    );

    let reviews = await ReviewModel.getReviewsByProductId(req.params.id);
  

    // get comments for every review
    let commentsForReviews = [];
    for (let review of reviews) {
      let comments = await CommentModel.getCommentsByReviewId(review.review_id);

      for (let comment of comments) {
        // format date for every review
        comment.created_at = moment(comment.date).fromNow();
      }
      commentsForReviews.push(comments);
      review.created_at = moment(review.date).fromNow();
    }

    res.render("./user/item", {
      user: req.session.userDetails,
      product: productInfo[0],
      reviews: reviews,
      comments: commentsForReviews,
    });
  }

  // This function add a product review
  async addReview(req, res) {
    await ReviewModel.addReview(
      req.session.userDetails.id,
      req.params.id,
      req.body.review
    );
    res.redirect(`/product/show/${req.params.id}`);
  }

  // this function adds a comments to review
  async addComment(req, res) {
    await CommentModel.addComment(
      req.session.userDetails.id,
      req.body.review_id,
      req.body.reply
    );
    res.redirect(`/product/show/${req.params.id}`);
  }
}

module.exports = new UserController();
