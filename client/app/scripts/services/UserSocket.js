'use strict';

app.service('UserSocket', ['SocketService',
    function(SocketService) {

        // put username every time a registered user sends a message

        var that = this;

        that.user = {};

        that.setUser = function(user){
            that.user = user;
        }

        that.removeUser = function(){
            that.user = {};
        }
        
        that.on = SocketService.on;

        that.send = function(event, data) {
            var data = data || {};
            data.username = that.user.username;
            SocketService.send(event, data);
        }

        that.broadcast = function(event, username, data) {
            var data = data || {};
            data.username = that.user.username;
            SocketService.broadcast(event, data);
        }


        that.ready = function(callback) {
            SocketService.on('open', callback);
            SocketService.connect();
        }

        that.connect = SocketService.connect
    }
]);
