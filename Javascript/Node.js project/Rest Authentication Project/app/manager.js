	// upload photo
	var multer   = require('multer');
	const fs = require('fs');
	var path     = require('path');
	
	var easyimg = require('easyimage');
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
		
		callback(null, file.fieldname + '-' + req.user._id);
	  }
	});
	module.exports.storage = storage;
	
	
	
	
	
	
	
	
	
	
