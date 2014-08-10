'use strict';

app.service('GamesManagerInterface', ['UserService', 'GamesManager',
    function(UserService, GamesManager) {


        var that = this;

        that.games = {};

        // var callbackFunctions = {};

        // var getGameCallback = function(event, gameId) {
        //     return callbackFunctions[event][gameId];
        // }

        // var listen = function(event) {
        //     UserService.on(event, function(data) {
        //         var callback = getGameCallback(event, data.gameId);
        //         if (callback) {
        //             callback(data.username, data.data);
        //         }
        //     });
        // }




        // this.registerEvent = function(event, gameId, callback) {
        //     if (!callbackFunctions[event]) {
        //         callbackFunctions[event] = {};
        //         listen(event);
        //     }
        //     callbackFunctions[event][gameId] = callback;
        // }


        // this.unregisterEvent = function(event, gameId) {
        //     if (callbackFunctions[event] && callbackFunctions[event][gameId]) {
        //         delete callbackFunctions[event][gameId];
        //     }
        // }



        // put gameId every time a message has game scope
        that.send = function(event, gameId, data) {
            var data = data || {};
            // data.username = username;
            UserService.send(event, {
                gameId: gameId,
                data: data
            });
        }

        that.onGameMessage = function(event, callback) {
            UserService.on(event, function(data) {
                if (callback) {
                    callback(data.gameId, data.username, data.data);
                }
            });
        }



        onGameMessage('game:all', function(gameId, username, games) {
            GamesManager.setGames(games);
        });



        onGameMessage('game:create', function(gameId, username, game) {
            GamesManager.createGame(game);
        });

        onGameMessage('game:delete', function(gameId, username, data) {
            GamesManager.deleteGame(gameId);
        });




        onGameMessage('game:register', function(gameId, username, data) {
            GamesManager.registerUserForGame(username, gameId);
        });

        onGameMessage('game:unregister', function(gameId, username, data) {
            GamesManager.unregisterUserForGame(username, gameId);
        });


    }
]);
