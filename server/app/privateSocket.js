var privateSocket = function() {
    var socketExtended = require('./socketExtended.js');


    var that = new socketExtended();

    that.users = {};
    // that.onlineUsers = {};


    // var login(username, password, connection){
    //     that.users[username] = connection;
    // }


    // var logout(username){
    //     that.users[username] = connection;
    // }



    var addUser = function(username, connection) {
        that.users[username] = connection;
    }

    var deleteUser = function(username) {
        // that.removeConnection(getConnectionFromUser(username));
        delete that.users[username];
    }

    var userExists = function(username) {
        return that.users[username] !== undefined;
    }

    var getConnectionFromUser = function(username) {
        return that.users[username];
    }

    var getUserFromConnection = function(connection) {
        for (var key in that.users) {
            if (that.users.hasOwnProperty(key)) {
                if (that.users[key] === connection) {
                    return key;
                }
            }
        }
        return false;
    }




    that.getUser = function(username) {
        return that.users[username];
    }

    that.getUsers = function() {
        return that.users;
    }

    that.getRaw = function() {
        var arr = [];
        for (var property in that.users) {
            if (that.users.hasOwnProperty(property)) {
                arr.push(property);
            }
        }
        return arr;
    }





    that.onClose = function(connection) {
        // deleteUser(getUserFromConnection(connection));
    };


    that.sendToUser = function(username, event, data) {
        that.send(getConnectionFromUser(username), event, data);
    }

    that.sendToUsers = function(usersArray, event, data) {
        usersArray.forEach(function(username) {
            that.send(getConnectionFromUser(username), event, data);
        });
    }

    that.onUserMessage = function(event, callback) {
        that.on(event, function(connection, requestObject) {
            if (requestObject.username && that.getUser(requestObject.username)) {
                callback(requestObject.username, requestObject.data, requestObject);
            } else {
                that.send(connection, 'auth', {
                    code: "UNAUTHORIZED",
                    text: 'Unauthorized call.'
                });
            }
        })
    }





    that.on('user:all', function(connection, data) {
        that.send(connection, 'user:all', that.getRaw());
    });


    that.on('user:register', function(connection, data) {

        var response;

        if (!data.username) {

            response = {
                code: "USERNAME_NOT_SPECIFIED",
                text: 'Username not specified.'
            }
            that.send(connection, 'user:register', response);

        }

        // else if (!data.password) {

        //     response = {
        //         code: "PASSWORD_NOT_SPECIFIED",
        //         text: 'Password not specified.'
        //     }
        //     that.send(connection, 'user:register', response);

        // }
        else if (userExists(data.username)) {

            response = {
                code: "USERNAME_UNIQUE",
                text: 'A user with the same username is already registered.'
            }
            that.send(connection, 'user:register', response);

        } else {

            addUser(data.username, connection);
            response = {
                username: data.username,
                code: true,
                text: 'Successful Registration.'
            }
            // that.send(connection, 'user:register', response);
            that.broadcast('user:register', response);

        }
    });


    that.onUserMessage('user:unregister', function(username, data) {
        deleteUser(username);
        that.broadcast('user:unregister', {
            username: username,
            code: true,
            text: 'Successful Unregistration.'
        });
    });






    that.on('user:createaccount', function(connection, data) {

        var response;

        if (!data.username) {

            response = {
                code: "USERNAME_NOT_SPECIFIED",
                text: 'Username not specified.'
            }

            that.send(connection, 'user:register', response);

        } else if (!data.password) {

            response = {
                code: "PASSWORD_NOT_SPECIFIED",
                text: 'Password not specified.'
            }

            that.send(connection, 'user:register', response);

        } else {

            addUser(data.username, connection);
            response = {
                username: data.username,
                code: true,
                text: 'Successful Registration.'
            }
            // that.send(connection, 'user:register', response);
            that.broadcast('user:register', response);

        }
    });



    return that;
}

module.exports = privateSocket;
