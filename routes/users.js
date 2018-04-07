var express = require('express');
var router = express.Router();
var mongoose=require('mongoose');
const bodyParser=require('body-parser');
var app=express();
app.use(bodyParser.json())
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var ensureAuthenticated=require('./index.js')
var User = require('../models/user');
var Document=require('../models/documents');
// Register
router.get('/register', function(req, res){
	res.render('register');
});

// Login
router.get('/login', function(req, res){
	res.render('login');
});

// Register User
router.post('/register', function(req, res){
	
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		res.render('register',{
			errors:errors
		});
	} else {
		var newUser = new User({
			
			email:email,
			password: password
		});

		User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		req.flash('success_msg', 'You are registered and can now login');

		res.redirect('/users/login');
	}
});

passport.use(new LocalStrategy({
      usernameField: 'email',
	  passwordField: 'password'
  },
	
  function(email, password, done) {
   User.getUserByEmail(email, function(err, user){
   	if(err) throw err;
   	if(!user){
   		return done(null, false, {message: 'Unknown User'});
   	}

   	User.comparePassword(password, user.password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			return done(null, user);
   		} else {
   			return done(null, false, {message: 'Invalid password'});
   		}
   	});
   });
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login',failureFlash: true}),
  function(req, res) {
    res.redirect('/');
  });


//document routes 
router.get('/documents',function(req,res){
	
	res.render('documents')
})



router.post('/documents',function(req,res){
  
		drivingLicenceNumber=req.body.drivingLicenceNumber,
		drivingLicenceName=req.body.drivingLicenceName,
		vehicle=req.body.vehicle,
		drivingLicenceDOB=req.body.drivingLicenceDOB,
		drivingCategory=req.body.drivingCategory,
		aadharName=req.body.aadharName,
		aadharNumber=req.body.aadharNumber,
		aadharCardDOB=req.body.aadharCardDOB
		
//validation
req.checkBody('drivingLicenceNumber', 'licence number required is required and should be min 4 char long').notEmpty()
req.checkBody('drivingLicenceName', 'name  is required and should be min 4 char log').notEmpty().isLength({ min: 4 })
req.checkBody('vehicle', 'vehicle name is required').notEmpty();
req.checkBody('drivingLicenceDOB', 'dob required').notEmpty();
req.checkBody('aadharName', 'name on adhar required and should be min 4 char long').notEmpty().isLength({min:4});
req.checkBody('aadharNumber', 'aadhar number required and should be exactly 10 char long').notEmpty().isLength({min:10});
req.checkBody('aadharCardDOB', 'dob required').notEmpty();



var errors = req.validationErrors();
if(errors){
	return res.render('documents',{
		errors:errors
	});
} else {
		
		var newDocument=new Document({
			drivingLicenceNumber:drivingLicenceNumber,
			drivingLicenceName:drivingLicenceName,
			vehicle:vehicle,
			drivingLicenceDOB:drivingLicenceDOB,
			drivingCategory:drivingCategory,
			aadharName:aadharName,
			aadharNumber:aadharNumber,
			aadharCardDOB:aadharCardDOB
			
		})	
	}

	newDocument.save().then(()=>{
		res.redirect('/users/documentdetails')
	})
	
})

router.get('/documentdetails',function(req,res){
	res.render('documentdetails')
})

router.post('/documentdetails',(req,res)=>{
	return Document.findOne({drivingLicenceName:req.body.drivingLicenceName},"-aadharNumber -aadharName -aadharCardDOB")
	.exec()
	.then((document)=>{
		if(!document){
			return res.send('no details with this name')
		}
		console.log(document)
		 res.send({"driving licence Details":document})
	})
	.catch((e)=>console.log(e))
})
router.post('/aadhardetails',(req,res)=>{
	return Document.findOne({aadharName:req.body.aadharName},"-drivingLicenceNumber -drivingLicenceName -drivingLicenceDOB -drivingCategory -vehicle")
	.exec()
	.then((document)=>{
		if(!document){
			return res.send('no details with this name')
		}
		console.log(document)
		 res.send({aadharDetails:document})
	})
	.catch((e)=>console.log(e))
})
router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
});

module.exports = router;