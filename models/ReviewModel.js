const EXPRESS_MODEL = require("../system/express_model");

class ReviewModel extends EXPRESS_MODEL {
  /*  
    DOCU: This function inserts new message from a user to the database.
  */
  async addReview(id, proudctID, content) {
    return await this.runQuery(
      "INSERT INTO messages (user_id, product_id, message) VALUES (?, ?, ?)",
      [id, proudctID, content]
    );
  }

  /* DOCU: This function retrieves all messages from the database. */

  async getReviewsByProductId(productID) {
    return await this.runQuery(
      'SELECT messages.id AS review_id, message AS content, messages.created_at AS date, CONCAT(first_name," ",last_name) AS senderName, products.id as product_id FROM messages LEFT JOIN users on messages.user_id=users.id LEFT JOIN products on messages.product_id=products.id WHERE messages.product_id= ? ORDER BY messages.created_at DESC',
      [productID]
    );
  }
}

module.exports = new ReviewModel();
