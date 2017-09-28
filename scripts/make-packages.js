var path = require("path");
var fs = require("fs");
var pkg = require("../package.json");

// Copy package to dist folder
fs.writeFile(path.join(__dirname,"../dist/package.json"), JSON.stringify(pkg, null, "\t"), function(err) {
    if(err) console.log(err);
});