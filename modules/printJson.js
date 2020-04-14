const fs = require('fs');

var printJson = function(json) {
    console.log("Printing JSON");
    var jsonContent = JSON.stringify(json, null, 2)
    fs.writeFile("output.json", jsonContent, 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
        console.log("JSON file has been saved.");
    });
}

module.exports = printJson;