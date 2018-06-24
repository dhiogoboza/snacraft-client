var DOMParser = require('xmldom').DOMParser;
var XMLSerializer = require('xmldom').XMLSerializer;
var fs = require('fs'),
    path = require('path'),    
    filePath = path.join(__dirname, 'index.html');

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
        fs.writeFile("dist/index.html", documentContent, function(error) {
            if (error) {
                return console.log(error);
            }
        }); 
    } else {
        console.log(error);
    }
});
