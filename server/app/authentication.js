// load up the user model
var User = require('../app/models/user');

// load the auth variables
var configAuth = require('./auth');


var googleAuth = function(token, refreshToken, profile, callback) {

    // make the code asynchronous
    // User.findOne won't fire until we have all our data back from Google
    process.nextTick(function() {

        // try to find the user based on their google id
        User.findOne({
            type: 'google',
            oauth2id: profile.id
        }, function(err, user) {
            if (err)
                callback(err);

            if (user) {

                // if a user is found, log them in
                return callback(user);
            } else {
                // if the user isnt in our database, create a new user
                var newUser = new User();

                // set all of the relevant information
                newUser.google.id = profile.id;
                newUser.google.token = token;
                newUser.google.name = profile.displayName;
                newUser.google.email = profile.emails[0].value; // pull the first email

                // save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return callback(newUser);
                });
            }
        });
    });

}


var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');

// We are going to protect /api routes with JWT
app.use('/api', expressJwt({
    secret: secret
}));

app.use(express.json());
app.use(express.urlencoded());




app.post('/authenticate', function(req, res) {
    //TODO validate req.body.username and req.body.password
    //if is invalid, return 401
    if (!(req.body.username === 'john.doe' && req.body.password === 'foobar')) {
        res.send(401, 'Wrong user or password');
        return;
    }

    var profile = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@doe.com',
        id: 123
    };

    // We are sending the profile inside the token
    var token = jwt.sign(profile, secret, {
        expiresInMinutes: 60 * 5
    });

    res.json({
        token: token
    });
});
