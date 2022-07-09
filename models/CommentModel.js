const EXPRESS_MODEL = require("../system/express_model");

class CommentModel extends EXPRESS_MODEL {
  // add comment
  async addComment(id, reviewID, content) {
    return await this.runQuery(
      "INSERT INTO comments(user_id, message_id, comment) VALUES (?, ?, ?)",
      [id, reviewID, content]
    );
  }
  // get all comments by review id
  async getCommentsByReviewId(reviewID) {
    return await this.runQuery(
      "SELECT comments.message_id, CONCAT(users.first_name,' ', users.last_name) AS senderName, comment AS content, comments.created_at AS date FROM comments LEFT JOIN users on comments.user_id=users.id WHERE comments.message_id= ?",
      [reviewID]
    );
  }
}

module.exports = new CommentModel();
