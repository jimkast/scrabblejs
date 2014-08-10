'use strict';

app.service('GameInterface', ['GamesSocket', 'GamesManagerInterface',
    function(GamesSocket, GamesManagerInterface) {

        var that = this;


        var callbacks = {};


        var tilesBuffer;


        GamesSocket.onGameMessage('game:start', function(gameId) {
            var game = GamesManagerInterface.GamesManager.getGame(gameId);
            game.start();

            if (game.onStart) {
                game.onStart();
            }
        });

        GamesSocket.onGameMessage('game:end', function(gameId, username, data) {
            var game = GamesManagerInterface.GamesManager.getGame(gameId);
            game.finish(data);

            if (game.onEnd) {
                game.onEnd(data);
            }
        });



        GamesSocket.onGameMessage('game:fold', function(gameId, username) {
            var game = GamesManagerInterface.GamesManager.getGame(gameId);

            game.removeTiles(username, tilesBuffer);
            // game.fold(username, tilesBuffer);

            if (game.onFold) {
                game.onFold(username, tilesBuffer);
            }

            tilesBuffer = null;
        });

        GamesSocket.onGameMessage('game:newmove', function(gameId, username, move) {
            var game = GamesManagerInterface.GamesManager.getGame(gameId);
            game.placeSuccessfulMove(username, move);

            if (game.onNewMove) {
                game.onNewMove(username, move);
            }
        });

        GamesSocket.onGameMessage('game:quit', function(gameId, username) {
            var game = GamesManagerInterface.GamesManager.getGame(gameId);
            game.quit(username, tilesBuffer);

            if (game.onQuit) {
                game.onQuit(username, tilesBuffer);
            }

            tilesBuffer = null;
        });

        GamesSocket.onGameMessage('game:turn', function(gameId, username) {
            var game = GamesManagerInterface.GamesManager.getGame(gameId);
            game.giveTurn(username);

            if (game.onTurn) {
                game.onTurn(username);
            }
        });

        GamesSocket.onGameMessage('game:tiles', function(gameId, username, tiles) {
            var game = GamesManagerInterface.GamesManager.getGame(gameId);
            game.sendTiles(username, tiles);

            if (game.onTilesGet) {
                game.onTilesGet(username, tiles);
            }
        });





        that.sendNewMove = function(gameId, placeholders) {
            GamesSocket.send('game:newmove', gameId, placeholders);
        }

        that.sendFold = function(gameId, tiles) {
            tilesBuffer = tiles;
            GamesSocket.send('game:fold', gameId, tiles);
        }        

        that.sendQuit = function(gameId, tiles) {
            tilesBuffer = tiles;
            GamesSocket.send('game:quit', gameId, tiles);
        }



        that.listen = GamesSocket.connect();

    }
]);
