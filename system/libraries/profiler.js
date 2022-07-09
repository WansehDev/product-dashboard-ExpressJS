const fs = require("fs");
const path = require("path");
const dir = path.join(__dirname, "../../views");
const table = path.join(__dirname, "./partial").replace(/\\/g, "/");
const model = require("../express_model")


class EXPRESS_PROFILER {
  constructor() {
    this.isEnabled = false; // default value is false
    this.query = "";
  }

  profiler(req, res, next) {
    let output = "{ ";
    for (let key in req.body) {
      output += ` ${key} : ${req.body[key]}`;
    }
    output += " }";

    if (!res.locals.partials)
      res.locals.partials = {
        method: req.method,
        url: req.url,
        data: output,
        query: ""
      };

    next();
  }

  profilerTable() {
    if(this.isEnabled) {
      fs.readdir(dir, (err, files) => {
        if (err) throw err;

        files.forEach((file) => {
          let filePath = path.join(dir, file);``
          let data = fs.readFileSync(filePath);
          let output = data
            .toString()
            .replace(/\<\/body>/g, `<%- include("${table}") %> </body>`);

          fs.writeFileSync(filePath, output);
        });
      });
    }
  }
}

module.exports = new EXPRESS_PROFILER();
