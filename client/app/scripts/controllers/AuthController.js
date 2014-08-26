'use strict';

app.controller('AuthController', ['$scope', 'UserManagement', '$cookieStore', '$http',
    function($scope, UserManagement, $cookieStore, $http) {



        var authModule = function(type) {


            var GoogleAuth = function() {

                var that = this;

                that.authdata;
                that.profile;

                var signinCallback = function(authResult) {
                    console.log(authResult);
                    if (authResult['status']['signed_in']) {
                        // Update the app to reflect a signed in user
                        // Hide the sign-in button now that the user is authorized, for example:
                        document.getElementById('signinButton').setAttribute('style', 'display: none');
                        that.authdata = authResult;

                        getUserInfo();

                    } else {
                        // Update the app to reflect a signed out user
                        // Possible error values:
                        //   "user_signed_out" - User is signed-out
                        //   "access_denied" - User denied access to your app
                        //   "immediate_failed" - Could not automatically log in the user
                        console.log('Sign-in state: ' + authResult['error']);
                    }


                }


                that.renderSignInButton = function() {
                    gapi.signin.render('signinButton', {
                        'callback': signinCallback, // Function handling the callback.
                        // 'clientid': '796534862997-aa70ttf57o1d8fflq9mcus9v8usbamga.apps.googleusercontent.com', // CLIENT_ID from developer console which has been explained earlier.
                        'clientid': '858566725308-g2j5k837l5j9f2t6fs1251r7batdmvhu.apps.googleusercontent.com', // CLIENT_ID from developer console which has been explained earlier.
                        'requestvisibleactions': 'http://schemas.google.com/AddActivity', // Visible actions, scope and cookie policy wont be described now,
                        // as their explanation is available in Google+ API Documentation.
                        'scope': 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email',
                        'cookiepolicy': 'single_host_origin'
                    });
                }


                // When callback is received, process user info.
                var userInfoCallback = function(userInfo) {
                    console.log(userInfo);
                    that.profile = userInfo;

                    that.serverLogin();
                    // processUserInfo(userInfo);
                };



                // Request user info.
                var getUserInfo = function() {
                    gapi.client.request({
                        'path': '/plus/v1/people/me',
                        'method': 'GET',
                        'callback': userInfoCallback
                    });
                };


                that.signOut = function() {
                    gapi.auth.signOut();
                }

                that.serverLogin = function() {
                    // var data = {
                    //     authType: 'google',
                    //     code: that.authdata.code,
                    //     client_id: that.authdata.client_id
                    // }

                    var data = {
                    	token: that.authdata.access_token
                    };
                    
                    $http.post('http://localhost:3000/auth/google3', data).then(function(response) {
                        console.log(response);
                    });



                    // $http({
                    //     method: 'GET',
                    //     url: 'http://localhost:3000/auth/google/callback',
                    //     data: that.authdata
                    // }).then(function(response) {
                    //     console.log(response);
                    // });


                    // $http({
                    //     method: 'POST',
                    //     url: 'https://accounts.google.com/o/oauth2/token',
                    //     headers: {
                    //         'Content-Type': 'application/x-www-form-urlencoded'
                    //     },


                    //     data: {
                    //         code: that.authdata.code,
                    //         client_id: that.authdata.client_id,
                    //         client_secret: '1sP0Mie4xcHz6VMlLJZOUjPO',
                    //         redirect_uri: 'http://localhost:3000/auth/google/callback',
                    //         grant_type: 'authorization_code'
                    //     }

                    // }).then(function(response){
                    // 	console.log(response);
                    // });

                }







            }

            switch (type) {
                case 'google':
                    return new GoogleAuth();
                    break;
                case 'facebook':
                    break;
                case 'twitter':
                    break;
                default:
                    break;
            }

        }






        $(window).load(function() {


            var gauth = new authModule('google');
            gauth.renderSignInButton();
            console.log(gauth);



        });


    }
]);
