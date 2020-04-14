var Twit = require('twit');
const fs = require('fs');
var config = require('./config');
var T = new Twit(config);

const printJson = require('./modules/printJson');
const editJson = require('./modules/editJson');

tweet();
setInterval(tweet, 1000*60*60*6); //Interval every 6 hours


function tweet(){
  const folder = './images/';
  var imageFilesObjectArray = [];
  ///Check if list file "output.json" exists
  try {
    ///>>>if it does exist
    if (fs.existsSync('./output.json')) {
      var imageFilesObjectArray = require('./output.json');
      
      fs.readdir(folder, (err, files) => {
        if(err){
          console.log(err);
        }
        ////Check if file is missing from the gallery
        //This will delete the reference to it in the JSON
        var found = false;
        for(var i = 0; i < imageFilesObjectArray.length; i++) {
          found = false;
          for(var j = 0; j < files.length; j++) {
            if (imageFilesObjectArray[i].fileName == files[j]) {
                found = true;
                break;
            }
          }
          if(found==false) {
            console.log("Un elemento de la lista no está en la galería... Borrando de la lista.");
            console.log('Elemento: '+ imageFilesObjectArray[i].fileName);
            imageFilesObjectArray.splice(i, 1);
            i=0;
          }
        }
        
        ////Check if reference is missing from the list
        //This will add the missing reference
        for(var i = 0; i < files.length; i++) {
          found = false;
          for(var j = 0; j < imageFilesObjectArray.length; j++) {
            if (files[i] == imageFilesObjectArray[j].fileName) {
                found = true;
                break;
            }
          }
          if(found==false) {
            console.log("Un elemento de la galería no está en la lista... Agregando la lista.");
            console.log('Elemento: '+ files[i]);
            var newObject = {};
            newObject.fileName = files[i];
            imageFilesObjectArray.push(newObject);
            i=0;
          }
        }
        printJson(imageFilesObjectArray);
        selectRandomImage();
      });
    ///>>>If it doesn't exist
    } else {
      fs.readdir(folder, (err, files) => {
        files.forEach(file => {
          var imageFile = {};
          imageFile.fileName = file;
          imageFilesObjectArray.push(imageFile);
        });
        printJson(imageFilesObjectArray);
        selectRandomImage();
      });
    }
  } catch(err) {
    console.error(err)
  }

  function selectRandomImage() {

    var notPublishedFiles = []; // Local Array to store not published files
    var randomNumber = 0;

    // Check if the global array for files is not empty
    if(imageFilesObjectArray.length>0) {
      for(var i = 0; i<imageFilesObjectArray.length; i++) {
        // Check if file has not been published already
        if(!imageFilesObjectArray[i].hasOwnProperty('selected')) {
          // if not push the file to the "not published files" array
          notPublishedFiles.push(imageFilesObjectArray[i]);
        }
      }
    } else {
      console.log("There are no files to upload");
      return; // Exit function
    }
    

    // Check if there are not published files available
    if(notPublishedFiles.length>0) {
      randomNumber = Math.floor(Math.random() * notPublishedFiles.length);
    } else {
      console.log("There are no more available files");
      return; // Exit function
    }
    
    console.log("Posting the image file named: "+imageFilesObjectArray[randomNumber].fileName);

    var filePath = folder+imageFilesObjectArray[randomNumber].fileName;
    imageFilesObjectArray[randomNumber].selected=true;
    var imageName = imageFilesObjectArray[randomNumber].fileName;

    T.postMediaChunked({file_path: filePath}, function (err, data, response) {
      var params = { status: imageName, media_ids: data.media_id_string}
      T.post('statuses/update', params, function (err, data, response) {
        if(err) {
          console.log(err)
        } else {
          console.log("The file has been succesfully uploaded");
        }
      });
    });

    editJson(randomNumber, imageFilesObjectArray);
    
  }
}