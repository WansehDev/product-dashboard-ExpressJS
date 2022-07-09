/*
A Validation class that can be used to validate user input.
@Author: Lance Parantar
Note: Will Update Soone
*/

class Validator {
  constructor() {
    this.output = "";
  }

  /*
    Validates the fields of the form
    @param: name: the name of the field to validate
    @param: message: the message to display if the field is invalid
    @param: args: the arguments to pass to the validator function
*/
  validateFields(name, userInput, args = null) {
    if (userInput.length === 0) {
      this.output += `<p> ${name} is required. </p>`;
    }
  }

  // Validates the email
  isEmail(name, email) {
    if (
      !email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    ) {
       this.output += `<p> ${name} must be a valid email. </p>`;
    }
  }

  // Checks if there are any errors in the validator
  isErrorFree() {
    if (this.output.length > 0) {
      return false;
    }
    return true;
  }

  // returns the errors
  getErrors() {
    return this.output;
  }

  createOwnError(message) {
    this.output += `<p> ${message} </p>`;
  }
}

// returns the output string
module.exports = Validator;
