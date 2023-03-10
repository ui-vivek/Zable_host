const passport = require('passport');
const LocalStrategy= require('passport-local').Strategy;
const User = require('../models/user');

// authontication using passport
passport.use(new LocalStrategy({
        usernameField :'email',   //usernameField is pre define Name
        passReqToCallback:true
    },
    function(req,email,password,done){
        //finding the user and establish the identity
        User.findOne({email:email},function(err,user){
            if(err){
                req.flash('error',err); 
                return done(err)
            }
            if(!user || user.password!=password){
                req.flash('error','Invalid Username/Password');
                return done(null, false);
            }
            return done(null,user);
        })
    }
));

// serializing the user to decide which key is to be kept
passport.serializeUser(function(user,done){
    done(null,user.id)
});

//deserializing the user form the key in the cookies
passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        if(err){console.log("There is an error find the user password.")
        return dene(err);
    }
    return done(null,user);
    });
});

// check if the user is authenticated
passport.checkAuthentication= function(req,res,next){
    //if the user is signed in, then pass on the request to the next function(controller's action)
    if(req.isAuthenticated()){
        return next();
    }
    //if user is not Authenticated
    return res.redirect('/users/sign-in')
}

passport.setAuthenticatedUser=function(req,res,next){
    if(req.isAuthenticated()){
        // req,user contains the current signed in user form the session cookie and we are just sending this to the locals for the views
        res.locals.user=req.user;
    }
    next();
}
module.exports=passport;