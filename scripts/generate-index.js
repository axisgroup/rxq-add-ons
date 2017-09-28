var path = require("path");
var fs = require("fs");

var srcFolder = "../src";
var tgtFolder = "";

fs.readdir(path.join(__dirname, srcFolder), (err, files) => {
    if(err) console.log(err);
    
    var importStr = "";
    var exportStr = "";
    var exports = [];
    files.forEach(file=>{
        var name = file.split(".js").shift();
        // importStr += `import ${name} from "./src/${file}";\n`;
        exportStr += `export {default as ${name}} from "./src/${file}";\n`;
    });

    var code = exportStr;
    
    fs.writeFile(path.join(__dirname,"../index.js"),code,(err)=>{
        if(err) console.log(err);
    });

});