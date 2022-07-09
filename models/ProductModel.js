const EXPRESS_MODEL = require("../system/express_model");

class ProductModel extends EXPRESS_MODEL {
  /*
    DOCUE: get the product by id
 */
  async getProductById(id) {
    return await this.runQuery("SELECT * FROM products WHERE id = ?", [id]);
  }

  /* DOCU: Shows All the product of the Admin */
  async getAllProducts() {
    return await this.runQuery("SELECT * FROM products");
  }

  /* DOCU: This function is triggered when the user clicks the create new product button. */
  async addProduct(productInfo) {
    // object to array
    let productInfoArray = Object.values(productInfo);
    return await this.runQuery(
      "INSERT INTO products (user_id, product_name, product_description, product_price, product_inventory, product_qty_sold) VALUES (?,?,?,?,?,?)",
      productInfoArray
    );
  }

  /* DOCU: This Function updates the product */
  async updateProduct(productInfo, id) {
    let productInfoArray = Object.values(productInfo);
    productInfoArray.push(id);
    return await this.runQuery(
      "UPDATE products SET product_name = ?, product_description = ?, product_price = ?, product_inventory = ? WHERE id = ?",
      productInfoArray
    );
  }

  /*  DOCU: This function is triggered when the user clicks the YES button to remove the product*/
  async deleteProduct(id) {
     await this.runQuery("SET FOREIGN_KEY_CHECKS=0;");
     await this.runQuery("DELETE FROM products WHERE id = ?", [id]);
     await this.runQuery("SET FOREIGN_KEY_CHECKS=1;");
  }
}

module.exports = new ProductModel();
