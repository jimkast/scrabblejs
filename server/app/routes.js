// app/routes.js

var configAuth = require('./../config/auth');

var http = require('http');
var https = require('https');
var querystring = require('querystring');







var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;

var oauth2Client = new OAuth2(configAuth.googleAuth.clientID, configAuth.googleAuth.clientSecret, configAuth.googleAuth.callbackURL);

// generate a url that asks permissions for Google+ and Google Calendar scopes
var scopes = [
    'https://www.googleapis.com/auth/plus.me'
];

var url = oauth2Client.generateAuthUrl({
    access_type: 'offline', // 'online' (default) or 'offline' (gets refresh_token)
    scope: scopes // If you only need one scope you can pass it as string
});








module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.ejs', {
            message: req.flash('loginMessage')
        });
    });

    // process the login form
    // app.post('/login', do all our passport stuff here);

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', {
            message: req.flash('signupMessage')
        });
    });

    // process the signup form
    // app.post('/signup', do all our passport stuff here);

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user: req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });



    // app.get('/oauth2callback', function(request, response) {
    //     response.send(response);
    // });




    app.post('/auth/google2', function(request, response) {

        // request.session.state = Math.random() + '&configAuth.googleAuth.callbackURL';
        // console.log('aaaaaaaaaaaaaaa', response.statusCode);
        // oauth2Client.getToken(request.body.code, function(err, tokens) {
        //     console.log('bbbbbbbbbbbbb', err);
        //     // Now tokens contains an access_token and an optional refresh_token. Save them.
        //     if (!err) {
        //         console.log(tokens, 'tokensssss');
        //         oauth2Client.setCredentials(tokens);
        //     }
        // });


        var post_data = {
            code: request.body.code,
            redirect_uri: configAuth.googleAuth.callbackURL,
            client_id: configAuth.googleAuth.clientID,
            client_secret: configAuth.googleAuth.clientSecret,
            grant_type: 'authorization_code'
        }


        var post_options = {
            host: 'accounts.google.com',
            path: '/o/oauth2/token',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': querystring.stringify(post_data).length
            }
        }

        var post_req = https.request(post_options, function(res) {
            res.setEncoding('utf8');
            console.log(res.headers, 'headersssss', res.statusCode)
            res.on('data', function(chunk) {
                console.log('Response: ' + chunk, configAuth.googleAuth.callbackURL);
                response.send(chunk)
            });
        });
        console.log(post_data, querystring.stringify(post_data));
        // post the data
        post_req.write(querystring.stringify(post_data));


        post_req.end();


    });






    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));


    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));





    // =====================================
    // GOOGLE ROUTES =======================
    // =====================================
    // send to google to do the authentication
    // profile gets us their basic information including their name
    // email gets their emails
    app.get('/auth/google', passport.authenticate('google', {
        scope: ['profile', 'email']
    }));

    // // the callback after google has authenticated the user
    // app.get('/auth/google/callback',
    //     passport.authenticate('google', {
    //         successRedirect: '/profile',
    //         failureRedirect: '/'
    //     }));


    // the callback after google has authenticated the user
    app.get('/oauth2callback',
        passport.authenticate('google'), function(request, response) {
            console.log(request.user);
            // response.redirect('/profile');
            // response.writeHead(200, { 'Content-Type': 'application/json' });
            response.send('aaaaaa\n ' + request.user);
        });



    app.post('/auth/google3', function(request, response) {
        var token = request.body.token;

        console.log(token);
        //verify token
        // example: https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=1/fFBGRNJru1FQd44AzqT3Zg
        https.get('https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' + token, function(tokenInfoResponse) {
            tokenInfoResponse.setEncoding('utf8');

            tokenInfoResponse.on('data', function(tokenInfo) {
                console.log(tokenInfo);
                var tokenInfo = JSON.parse(tokenInfo);
                if (tokenInfo.user_id) { // valid token

                    console.log(tokenInfo);

                    // then get user profile
                    // https://www.googleapis.com/plus/v1/people/<userId>?access_token=1/fFBGRNJru1FQd44AzqT3Zg
                    https.get('https://www.googleapis.com/plus/v1/people/' + tokenInfo.user_id + '?access_token=' + token, function(profileResponse) {

                        profileResponse.setEncoding('utf8');
                        profileResponse.on('data', function(profileInfo) {

                            var profile = JSON.parse(profileInfo);

                            console.log(profile);

                            // saveUser(tokenInfo.user_id, token, profile);

                        });

                    });



                    /* ---- SAMPLE RESPONSE ----
                            {
                                kind: "plus#person",
                                etag: ""
                                pNz5TVTpPz2Rn5Xw8UrubkkbOJ0 / CqYMjUex3z3 - pRzX4tr6lv5AN8k "",
                                emails: [{
                                    value: "jimkast.ath@gmail.com",
                                    type: "account"
                                }],
                                objectType: "person",
                                id: "111481390792066351531",
                                displayName: "Jim Kastanis",
                                name: {
                                    familyName: "Kastanis",
                                    givenName: "Jim"
                                },
                                url: "https://plus.google.com/111481390792066351531",
                                image: {
                                    url: "https://lh5.googleusercontent.com/-83ivvsu6104/AAAAAAAAAAI/AAAAAAAAAwo/gD0iCw74bS4/photo.jpg?sz=50",
                                    isDefault: false
                                },
                                placesLived: [{
                                    value: "Megara, West Attica, Attica, Greece",
                                    primary: true
                                }],
                                isPlusUser: true,
                                language: "en",
                                ageRange: {
                                    min: 21
                                },
                                circledByCount: 14,
                                verified: false
                            }
                            */


                }

            });


            /* ---- SAMPLE RESPONSE ----

            {
                issued_to: "858566725308-g2j5k837l5j9f2t6fs1251r7batdmvhu.apps.googleusercontent.com",
                audience: "858566725308-g2j5k837l5j9f2t6fs1251r7batdmvhu.apps.googleusercontent.com",
                user_id: "111481390792066351531",
                scope: "https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/plus.moments.write https://www.googleapis.com/auth/plus.me https://www.googleapis.com/auth/plus.profile.agerange.read https://www.googleapis.com/auth/plus.profile.language.read https://www.googleapis.com/auth/plus.circles.members.read https://www.googleapis.com/auth/userinfo.profile",
                expires_in: 2856,
                email: "jimkast.ath@gmail.com",
                verified_email: true,
                access_type: "online"
            }


            */






        })



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
