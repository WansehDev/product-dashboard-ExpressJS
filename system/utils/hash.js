/*
    A Hash class that can be used to hash and compare passwords.
    @Author: Lance Parantar
*/
const md5 = require("md5");
class Hash {
    static encrypt(...args) {
        let concatString = "";
        args.forEach(string => {
            concatString += string;
        });
        return md5(concatString);
    }
}

module.exports = Hash;