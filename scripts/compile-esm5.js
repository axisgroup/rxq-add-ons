var path = require("path");
var fs = require("fs");
var rimraf = require("rimraf");
var babel = require("babel-core");

// Set up dist
mkDir("dist");
// Remove _esm5 if it exists
rimraf.sync("dist/_esm5", {}, function() {});
// Set up _esm5
mkDir("dist/_esm5");

// Convert and copy over index
babel.transformFile(path.join(__dirname,"../index.js"), {
        presets: [["es2015", { modules: false } ]],
        plugins: []
}, (err, result) => {
    if(err) return console.log(err);
    fs.writeFile(path.join(__dirname,"../dist/_esm5","index.js"), result.code, function(err) {
        if(err) return console.log(err);
    });
});

// Convert and copy over operators
mkDir("dist/_esm5/src");

fs.readdir(path.join(__dirname,"../src"), (err, files) => {
    files.forEach((file) => {
        babel.transformFile(path.join(__dirname,`../src/${file}`), {
                presets: [["es2015", { modules: false } ]],
                plugins: []
        }, (err, result) => {
            if(err) return console.log(err);
            fs.writeFile(path.join(__dirname,"../dist/_esm5/src",file), result.code, function(err) {
                if(err) return console.log(err);
            });
        });
    })
});


function mkDir(dir) {
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
}