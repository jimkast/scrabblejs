'use strict';

app.service('GamesSocket', ['UserSocket',
    function(UserSocket) {

        var that = this;

        that.broadcast = function(event, data) {
            data.gameId = that.user.username;
            UserSocket.broadcast(event, data);
        }

        that.onGameMessage = function(event, callback) {
            UserSocket.on(event, function(data) {
                if (callback) {
                    callback(data.gameId, data.username, data.data);
                }
            });
        }


        that.send = function(event, gameId, data) {

            UserSocket.send(event, {
                gameId: gameId,
                data: data
            });
        }

        that.ready = UserSocket.ready;

        that.connect = UserSocket.connect

    }
]);
