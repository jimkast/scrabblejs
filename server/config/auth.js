// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth': {
        'clientID': 'your-secret-clientID-here', // your App ID
        'clientSecret': 'your-client-secret-here', // your App Secret
        'callbackURL': 'http://localhost:3000/auth/facebook/callback'
    },

    'twitterAuth': {
        'consumerKey': 'your-consumer-key-here',
        'consumerSecret': 'your-client-secret-here',
        'callbackURL': 'http://localhost:3000/auth/twitter/callback'
    },

    'googleAuth': {
        'clientID': '796534862997-aa70ttf57o1d8fflq9mcus9v8usbamga.apps.googleusercontent.com',
        'clientSecret': '1sP0Mie4xcHz6VMlLJZOUjPO',
        'callbackURL': 'http://localhost:3000/auth/google/callback'
    }

};

