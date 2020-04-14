const fs = require('fs');

var editJson = function(index, fileJson) {
    console.log("Editing JSON file...");
    fileJson[index].selected=true;
    var jsonContent = JSON.stringify(fileJson, null, 2);
    fs.writeFile("output.json", jsonContent, 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
        console.log("JSON file has been saved.");
    });
}

module.exports = editJson;