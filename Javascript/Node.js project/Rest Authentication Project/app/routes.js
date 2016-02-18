module.exports = function(app, passport) {
	
	var User     = require('./models/user');
	var manager   = require('./manager.js');
	
	var multer   = require('multer');
	var path     = require('path');
	var easyimg = require('easyimage');
	var express  = require('express');
	//module.exports.userId = User._id;
	var upload = multer({ storage : manager.storage}).single('userPhoto');
	
    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });
	
	//====================================
	// List user
	app.get('/listUser', function(req, res) {
		User.find(function(err, users) {
            if (err)
                res.send(err);
            else
				res.render('listUser.ejs', { title : 'List User', users : users
				});
		});	
    });
	
	app.get('/userPhoto-'+':id', function(req, res){
    res.sendfile(path.join(__dirname,'../uploads/'+ req.user._id +'/'+ req.user.local.picture));
	});
	// choose pic
	app.get('/upload',function(req,res){
      res.render(path.join(__dirname,'../views/upload_pic.ejs'),{ user : req.user });
	});
	
	// upload pic
	app.post('/upload_photo',function(req,res){
		upload(req,res,function(err) {
			if(err) {
				return res.end("Error uploading file.");
			}
			else // UPDATE PICTURE PATH ON USER TO DISPLAY LATER
			{
				
				User.update({ "local.email" :  req.user.local.email }, {
					  $set: { "local.picture": 'userPhoto' + '-' + req.user._id },
				
				},function(err, results) {
					console.log(results);
					//callback();
				});
				
				var localPicture = path.join(__dirname, './../uploads/'+ req.user._id +'/','userPhoto' + '-' + req.user._id);
				easyimg.rescrop({
					 src: localPicture,
					 dst: localPicture,
					 width:200, height:200,
					 cropwidth:128, cropheight:128,
					 x:0, y:0
				  }).then(
				  function(image) {
					 console.log('Resized and cropped: ' + image.width + ' x ' + image.height);
				  },
				  function (err) {
					console.log(err);
				  }
				);				
				console.log("TEST:"+req.user.local.picture);
				
				res.end("File is successfully uploaded"); // next feature, get the filename
			}
			});
		
	});
	
    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {
		
        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') }); 
    });
	
    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
	
	  

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        
		res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });
	
	
	
    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}