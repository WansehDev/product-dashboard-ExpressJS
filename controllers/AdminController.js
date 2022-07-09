const ProductModel = require("../models/ProductModel");
const Validator = require("../system/utils/validator");

class AdminController {
  /*  DOCU: This function is triggered when the user clicks the create new product button. */
  async createProductPage(req, res) {
    res.render("./admin/createProduct", {
      user: req.session.userDetails,
      error: req.session.error,
      success: req.session.success,
    });
  }

  /*  DOCU: This function is triggered when the user clicks the edit button to edit the product */
  async editProductPage(req, res) {
    // get the product info
    let productInfo = await ProductModel.getProductById(req.params.id);
    res.render("./admin/editProduct", {
      user: req.session.userDetails,
      product: productInfo[0],
      success: req.session.success,
    });
  }

  /*  DOCU: This function is triggered when the user clicks the remove button to remove the product*/
  async removeProductPage(req, res) {
    // get the product data
    let productInfo = await ProductModel.getProductById(req.params.id);
    res.render("./admin/removeProduct", {user: req.session.userDetails, product: productInfo[0]});
  }

  /*  DOCU: This function is triggered when the user clicks the YES button to remove the product*/
  async confirmDeleteProduct(req, res) {
    await ProductModel.deleteProduct(req.params.id);
    res.redirect("/adminDashboard");
  }


  async updateProduct(req, res) {
    let result = await ProductModel.updateProduct(req.body, req.params.id);
    if (result.changedRows > 0) {
        req.session.success = "Product updated successfully";
    }
    res.redirect(`/edit/${req.params.id}`);
  }

  /* DOCU: This function adds a product to the database */
  async addProduct(req, res) {
    // Add the product here
    let validator = new Validator();
    for (let key in req.body) {
      validator.validateFields(key, req.body[key]);
    }

    if (validator.isErrorFree()) {
      let productInfo = {
        userID: req.session.userDetails.id,
        product_name: req.body.product_name,
        product_description: req.body.product_description,
        product_price: req.body.product_price,
        product_quantity: req.body.product_inventory,
        product_qty_sold: Math.floor(Math.random() * 100) + 1,
      };
      await ProductModel.addProduct(productInfo);
      req.session.success = "Product added successfully";
    } else {
      req.session.error = validator.getErrors();
    }
    res.redirect("/admin/create");
  }
}

module.exports = new AdminController();
