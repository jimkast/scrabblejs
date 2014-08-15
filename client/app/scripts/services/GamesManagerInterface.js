'use strict';

app.service('GamesManagerInterface', ['GamesSocket', 'UserManagement',
    function(GamesSocket, UserManagement) {

        var that = this;

        that.GamesManager = new scrabble.GamesManager();

        // that.setManager = function(manager) {
        //     that.GamesManager = manager;
        // }


        that.onAllGames = function() {};
        that.onCreate = function() {};
        that.onDelete = function() {};
        that.onUserRegistration = function() {};
        that.onUserUnregistration = function() {};



        that.update = function() {
            that.GamesManager.gamesArray.forEach(function(game) {
                var me = game.getUser(UserManagement.me.username);
                if (me){
                    game.registered = true;
                }
            })
        }

        that.getAllGames = function() {
            GamesSocket.send('game:all');
        }

        GamesSocket.onGameMessage('game:all', function(gameId, username, games) {
            console.log(games, 'game:alllll');

            that.GamesManager.setGames(games);
            that.update();
            that.onAllGames();
        });




        that.createGame = function(name, players, languagePackCode) {
            GamesSocket.send('game:new', null, {
                name: name,
                players: players,
                languagePackCode: languagePackCode
            });
        }

        GamesSocket.onGameMessage('game:new', function(gameId, username, game) {
            that.GamesManager.createGame(game);

            that.onCreate(username, gameId);
        });







        that.deleteGame = function(gameId) {
            GamesSocket.send('game:delete', gameId);
        }

        GamesSocket.onGameMessage('game:delete', function(gameId, username) {
            that.GamesManager.deleteGame(gameId);
            that.onDelete(username, gameId);

        });





        that.registerForGame = function(gameId) {
            GamesSocket.send('game:register', gameId);
        }

        GamesSocket.onGameMessage('game:register', function(gameId, username) {
            that.GamesManager.registerUserForGame(username, gameId);

            that.onUserRegistration(username, gameId);
        });






        that.unregisterFromGame = function(gameId) {
            GamesSocket.send('game:unregister', gameId);

        }

        GamesSocket.onGameMessage('game:unregister', function(gameId, username, data) {
            that.GamesManager.unregisterUserFromGame(username, gameId);
            that.onUserUnregistration(username, gameId);
        });


    }
]);
