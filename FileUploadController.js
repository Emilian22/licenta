'use strict'
const fs = require('fs');
const fsPath=require('fs-path')

let FileUploadController = function() {};

FileUploadController.prototype.uploadFile = function(req, res) {
  fs.readFile(req.files.file.path, function (err, data) {
      console.warn(req.files.file)
      console.log(req.body)
      
    var filepath = "./uploads/" + req.body.idCourse+"/"+req.body.idChapter+"/" + "File.pdf";

  
    fsPath.writeFile(filepath, data, function (err) {
      if (err) {
        return console.warn(err);
      }
    });
  });
}

module.exports = new FileUploadController();