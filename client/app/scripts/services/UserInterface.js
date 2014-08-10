'use strict';

app.service('UserInterface', ['UserSocket', 'UserManagement',
    function(UserSocket, UserManagement) {

        var that = this;


        that.onAllUsers = function() {};
        that.onRegistration = function() {};
        that.onUnregistration = function() {};



        that.register = function(username, callback) {
            UserSocket.setUser({
                username: username
            });
            UserManagement.preLogin(username);
            UserSocket.send('user:register');

        }

        UserSocket.on('user:register', function(data) {
            if (data.code === true) {
                console.log('User ' + data.username + ' have successfully registered.');

                if (UserManagement.isMe(data.username)) {
                    UserManagement.login();
                } else {
                    UserManagement.addUser(data.username);
                }

                that.onRegistration(data.username);

            } else {
                console.log(data.code);

                if (UserManagement.isMe(data.username)) {
                    UserManagement.logout();
                    UserSocket.removeUser();
                }
            }
        });




        that.unregister = function(callback) {
            UserSocket.send('user:unregister');

        }

        UserSocket.on('user:unregister', function(data) {
            if (data.code === true) {
                console.log('User' + data.username + ' have successfully unregistered.');

                if (UserManagement.isMe(data.username)) {
                    UserManagement.logout();
                } else {
                    UserManagement.removeUser(data.username);
                }

                that.onUnregistration(data.username);

            } else {
                console.log(data.code);
            }
        });




        that.getAllUsers = function(callback) {
            UserSocket.send('user:all');

        }


        UserSocket.on('user:all', function(users) {
            console.log(users, 'All Users');

            UserManagement.setAllUsers(users);

            that.onAllUsers();
        });



        that.ready = UserSocket.ready;

    }
]);
