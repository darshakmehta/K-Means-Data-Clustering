// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

   
    'facebookAuth' : {
        'clientID'      : '1506704702971355', // your App ID
        'clientSecret'  : '59c7cac36a09f3e75fb0f1fb58bf2743', // your App Secret
        'callbackURL'   : 'http://localhost:8080/auth/facebook/callback'
    }

};
