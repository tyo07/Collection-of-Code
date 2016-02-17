var express = require('express');
var app = express();
var fs = require("fs");

var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer({ dest: './uploads' });

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/indexx.htm', function (req, res) {
   res.sendFile( __dirname + "/" + "indexx.htm" );
})

app.post('/file_upload', function (req, res) {

    console.log('FIRST TEST: ' + JSON.stringify(req.files));
    console.log('second TEST: ' +req.files.file.name);
    fs.readFile(req.files.file.path, function (err, data) {
        var newPath = __dirname + "/" +req.files.file.name;
        fs.writeFile(newPath, data, function (err) {
          res.send("hi");  
        });
    });
})

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})