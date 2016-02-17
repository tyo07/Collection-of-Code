var app = express();
app.use('/uploads', express.static(__dirname + &quot;/uploads&quot;));
app.use(multer({dest: './uploads/'}))

var fs = require('fs');
var mongoose = require('mongoose');
router.all('/upload',function(req,res){
     var dirname = require('path').dirname(__dirname);
     var filename = req.files.file.name;
     var path = req.files.file.path;
     var type = req.files.file.mimetype;
      
     var read_stream =  fs.createReadStream(dirname + '/' + path);
 
     var conn = req.conn;
     var Grid = require('gridfs-stream');
     Grid.mongo = mongoose.mongo;
 
     var gfs = Grid(conn.db);
      
     var writestream = gfs.createWriteStream({
        filename: filename
    });
     read_stream.pipe(writestream);
        
});

router.get('/file/:id',function(req,res){
      var pic_id = req.param('id');
      var gfs = req.gfs;
 
       gfs.files.find({filename: pic_id}).toArray(function (err, files) {
 
        if (err) {
            res.json(err);
        }
        if (files.length > 0) {
            var mime = 'image/jpeg';
            res.set('Content-Type', mime);
            var read_stream = gfs.createReadStream({filename: pic_id});
            read_stream.pipe(res);
        } else {
            res.json('File Not Found');
        }
    });
});