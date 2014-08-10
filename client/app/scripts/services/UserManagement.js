'use strict';

app.service('UserManagement', [

    function() {

        /* ------ MODEL ------- */
        var that = this;


        that.setUser = function(users) {
            that.usersList = users;
        }

        that.me = {
            registered: false
        };

        that.users = [];

        // this.connect = SocketService.connect;

        that.preLogin = function(username) {
            that.me.username = username;
        }

        that.login = function(username) {
            that.me.registered = true;
            return that.user;
        }

        that.logout = function(username) {
            that.me.registered = false;
            delete that.me.username;
        }

        that.me = function() {
            return that.me;
        }

        that.isMe = function(username) {
            return username === that.me.username;
        }




        // that.userExists = function(username) {
        //     return that.users.some(function(user) {
        //         return user.username;
        //     });
        // }

        var userExists = function(username) {
            return that.getUser(username) !== false;
        }

        that.getUser = function(username) {
            var index = 0;
            var userExists = that.users.some(function(user) {
                index++;
                return user.username;
            });
            if (userExists) {
                return that.users[index - 1];
            } else {
                return false;
            }
        }


        that.addUser = function(user) {
            that.users.push(user);
        }

        that.removeUser = function(username) {
            var user = that.getUser(username);

            if (user) {
                that.users.splice(that.users.indexOf(user), 1);
            }
        }


        that.setAllUsers = function(users) {
            users.forEach(function(user){
                that.users.push(user);
            })
            // that.users = users;
        }


    }
]);
