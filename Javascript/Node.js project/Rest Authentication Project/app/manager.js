	// upload photo
	var multer   = require('multer');
	const fs = require('fs');
	var path     = require('path');
	// multer
	var storage =   multer.diskStorage({
	  destination: function (req, file, callback) {
		
		var dir =   path.join(__dirname,'../uploads/'+ req.user._id) // create custom directory for each user
		if (!fs.existsSync(dir)){
			fs.mkdirSync(dir);
		}
		callback(null, dir);
	  },
	  filename: function (req, file, callback) {
		
		callback(null, file.fieldname + '-' + Date.now());
	  }
	});
	module.exports.storage = storage;
	
	
	
	
	
	
