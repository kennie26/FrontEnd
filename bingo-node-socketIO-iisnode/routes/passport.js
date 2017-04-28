module.exports = function( passport, localStrategy, db ) {

  // Serialize user
  passport.serializeUser( function( user, done){
      done(null, user.id);
  });

  // Deserialize user
  passport.deserializeUser(function(id, done){
      User.findById(id, function(err, user){
        done(err, user);
      });
  });

  // Passport signup
  passport.use('local-signup', new localStrategy({
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback: true
    },
    function( req, email, password, done){

        // Check that the email is in the right format
        if( !validator.isEmail(email) ){
          return done(null, false, req.flash('loginMessage','That is not a valid email address'));
        }

        // Check that the password is at least 8 chars
        if( password.length < 8 ){
          return done(null, false, req.flash('loginMessage','The password needs to be 8 chars long'));
        }

        process.nextTick(function(){
          User.findOne( {'local.email' : email }, function(err, user){
            if(err){
              return done(err);
            }
            if(user){
              return done(null, false, req.flash('loginMessage','That email is already in use'));
            }else{
              var newUser = new User();
              newUser.local.email = email;
              newUser.local.password = password;
              newUser.save(function(err){
                if(err){
                  console.log(err);
                }
                return done(null, newUser, req.flash('loginMessage', 'Logged in successfully'));
              });
            }
          });
        });
    }));

  // Passport login
  passport.use('local-login', new localStrategy({
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback: true
    },
    function( req, email, password, done){
        process.nextTick(function(){
          User.findOne( {'local.email' : email }, function(err, user){
            if(err){
              return done(err);
            }

            if(!user){
              return done(null,false, req.flash('loginMessage', 'sorry no one by that email'));
            }

            user.validPassword(password, function(err, isMatch){

              if(isMatch){
                return done(null, user, req.flash('loginMessage', 'Logged in successfully'));
              }

              return done(null,false, req.flash('loginMessage', 'sorry wrong password'));
            })
          });
        });
    }));

} // Module Exports End
