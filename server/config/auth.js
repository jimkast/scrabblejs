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
        'clientID': '858566725308-g2j5k837l5j9f2t6fs1251r7batdmvhu.apps.googleusercontent.com',
        'clientSecret': '5e77F8ygr8Fy2Cb7pPusIyhT',
        'callbackURL': 'http://localhost:3000/oauth2callback'
    }

};
