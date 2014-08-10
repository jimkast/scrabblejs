'use strict';

app.factory('GameFactory', ['GamesManagerService',
    function(GamesManagerService) {

        var gService = function(gameId) {

            var that = this;

            that.gameId = gameId;


            // that.init = function(gameId) {
            //     that.gameId = gameId;
            //     console.log('-------------------------');
            //     console.log('Game Factory' + that.gameId);
            //     console.log('-------------------------');
            // }



            that.fold = function(tiles) {
                GamesManagerService.send('game:fold', that.gameId, tiles);
            }

            that.onFold = function(callback) {
                GamesManagerService.registerEvent('game:fold', that.gameId, callback);
            }




            that.submitMove = function(move) {
                GamesManagerService.send('game:newmove', that.gameId, move);
            }

            that.onNewmove = function(callback) {
                GamesManagerService.registerEvent('game:newmove', that.gameId, callback);
            }




            that.quit = function(tiles) {
                GamesManagerService.send('game:quit', that.gameId, tiles);
            }

            that.onQuit = function(callback) {
                GamesManagerService.registerEvent('game:quit', that.gameId, callback);
            }




            that.onUserTurn = function(callback) {
                GamesManagerService.registerEvent('game:turn', that.gameId, callback);
            }

            that.onStart = function(callback) {
                GamesManagerService.registerEvent('game:start', that.gameId, callback);
            }

            that.onFinish = function(callback) {
                GamesManagerService.registerEvent('game:end', that.gameId, callback);
            }

            that.onTilesGet = function(callback) {
                GamesManagerService.registerEvent('game:tiles', that.gameId, callback);
            }



        }

        return gService;

    }
]);
