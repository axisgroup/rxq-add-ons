var path = require("path");
var fs = require("fs");
var rimraf = require("rimraf");
var babel = require("babel-core");

// Set up dist
mkDir("dist");
// Remove _cjs if it exists
rimraf.sync("dist/_cjs", {}, function() {});
// Set up _cjs
mkDir("dist/_cjs");

// Convert and copy over index
babel.transformFile(path.join(__dirname,"../index.js"), {
        presets: [["es2015", { modules: false } ]],
        plugins: ["add-module-exports", "transform-es2015-modules-commonjs", "transform-runtime"]
}, (err, result) => {
    if(err) return console.log(err);
    fs.writeFile(path.join(__dirname,"../dist/_cjs","index.js"), result.code, function(err) {
        if(err) return console.log(err);
    });
});

// Convert and copy over operators
mkDir("dist/_cjs/src");

fs.readdir(path.join(__dirname,"../src"), (err, files) => {
    files.forEach((file) => {
        babel.transformFile(path.join(__dirname,`../src/${file}`), {
                presets: [["es2015", { modules: false } ]],
                plugins: ["add-module-exports", "transform-es2015-modules-commonjs", "transform-runtime"]
        }, (err, result) => {
            if(err) return console.log(err);
            fs.writeFile(path.join(__dirname,"../dist/_cjs/src",file), result.code, function(err) {
                if(err) return console.log(err);
            });
        });
    })
});

/*
// Iterate through source code and copy over
var srcFolder = "src";
var tgtFolder = "dist/_cjs";

compileFromDir(srcFolder, tgtFolder);

function compileFromDir(srcFolder,tgtFolder) {
    fs.readdir(srcFolder, function(err, files) {
        files.forEach(function(file) {
            fs.lstat(path.join(srcFolder,file), function(err, stats) {
                if(stats.isFile() && file.slice(-3) === ".js") {
                    console.log("convert the file " + file);
                    babel.transformFile(path.join(srcFolder,file), {
                        presets: ["es2015"],
                        plugins: ["add-module-exports", "transform-es2015-modules-commonjs", "transform-runtime"]
                    }, function(err, result) {
                        fs.writeFile(path.join(tgtFolder,file), result.code, function(err) {
                            if(err) return console.log(err);
                        });
                    });
                }
                else if(stats.isDirectory()) {
                    mkDir(path.join(tgtFolder, file));
                    compileFromDir(path.join(srcFolder,file), path.join(tgtFolder, file));
                }
            });
        });
    });
}
*/

function mkDir(dir) {
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
}