var DOMParser = require('xmldom').DOMParser;
var XMLSerializer = require('xmldom').XMLSerializer;
var fs = require('fs'), path = require('path');
var files = [{path: path.join(__dirname, 'index.html'), name: 'index.html'},
       {path: path.join(__dirname, 'about.html'), name: 'about.html'}];
var filePath, fileName;
var file_index = 0;

function readFile() {
    filePath = files[file_index]['path'];
    fileName = files[file_index]['name'];
    fs.readFile(filePath, 'utf8', function(error, data) {
        if (!error) {
            var parser = new DOMParser();
            var document = new DOMParser().parseFromString(data, "text/html");
            var scripts = document.getElementsByTagName("script");
            for (var i = 0; i < scripts.length; i++) {
                var script = scripts[i];
                var src = script.getAttribute("src");
                if (src.startsWith("js/")) {
                    document.removeChild(script);
                }
            }
            var mainScript = document.createElement("script");
            mainScript.setAttribute("src", "js/main.js");
            document.getElementsByTagName("body")[0].appendChild(mainScript);
            var documentContent = new XMLSerializer().serializeToString(document);
            documentContent = documentContent.replace("async=\"async\"", "async");
            fs.writeFile("dist/" + fileName, documentContent, function(error) {
                file_index++;
                if (error) {
                    return console.log(error);
                } else {
                    if (file_index < files.length) {
                        readFile();
                    }
                }
            }); 
        } else {
            console.log(error);
        }
    });
}

readFile();
