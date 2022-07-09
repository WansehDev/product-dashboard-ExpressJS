const EXPRESS_MODEL = require("../system/express_model");

class UserModel extends EXPRESS_MODEL {
  /*  
    DOCU: This function retrieves user information.
    */

  async getUserById(userId) {
    return await this.runQuery("SELECT * FROM users WHERE id = ?", [userId]);
  }

  /*  
    DOCU: This function retrieves user information filtered by email.
    */

  async getUserByEmail(userEmail) {
    return await this.runQuery("SELECT * FROM users WHERE email = ?", [
      userEmail,
    ]);
  }

  async createUser(userInfo, hashPassword) {
    let countUsers = await this.fetchAll("SELECT * FROM users");
    let setAdmin = 1;
    if (countUsers.length > 0) {
      setAdmin = 0;
    }

    return await this.runQuery(
      "INSERT INTO users (first_name, last_name, email, is_admin, salt, password) VALUES (?, ?, ?, ?, ?, ?)",
      [
        userInfo.first_name,
        userInfo.last_name,
        userInfo.email,
        setAdmin,
        hashPassword.salt,
        hashPassword.hash,
      ]
    ).then((result) => {
      console.log("User created", result);
      return result;
    });
  }

  async saveProfile(userInfo, id) {
    let userInfoArray = Object.values(userInfo);
    userInfoArray.push(id);
    return await this.runQuery(
      "UPDATE users SET email = ?, first_name = ?, last_name = ? WHERE id = ?",
      userInfoArray
    );
  }

  async getOldPassword(id) {
    return await this.runQuery(
      "SELECT salt, password FROM users WHERE id = ?",
      [id]
    );
  }

  async savePassword(hash, id) {
    return await this.runQuery(
      "UPDATE users SET salt = ?, password = ? WHERE id = ?",
      [hash.salt, hash.hash, id]
    );
  }
}

module.exports = new UserModel();
