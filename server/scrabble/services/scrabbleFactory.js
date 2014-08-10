app.factory('scrabbleFactory', ['$rootScope', 'SocketService',
    function($rootScope, SocketService) {

        SocketService.connect();

        var service = function() {

            var that = this;

            this.id = Math.random();
            this.playLettersLength = 7;
            this.board = new scrabble.Board();
            this.bucket = new scrabble.Bucket(scrabble.langPacks.el);

            this.checkWord = function(word) {
                // CHeck if word exists
                return true;
            }

            this.sendMove = function(move, callback) {

                var decorate = function(move) {
                    var arr = [];

                    move.placeholders.forEach(function(placeholder) {
                        arr.push(placeholder.getRaw());
                    })

                    return arr;
                }
                SocketService.send('newmove', decorate(move));
                // $rootScope.$broadcast('newmove', move);
            }

            this.onMoveReceive = function(callback) {
                SocketService.on('newmove', function(data) {
                    console.log(data, "RECEIVED A NEW MOVE!!!!!!!!!");
                    callback(data);
                    // $rootScope.$broadcast('newmove', move);
                });
            }

            this.fold = function(foldTiles) {
                SocketService.send('fold', foldTiles);
            }









            this.quit = function(playerName) {
                SocketService.send('quit', playerName);
            }


            var waitForPlayers = function(callback) {
                SocketService.on('register', function(playerName) {
                    console.log(playerName, " registered for the game");
                    callback(data);
                });
            }


            this.getPlayers = function(q) {

            }

            this.gameCreate = function(gameName, playersNumber, language) {
                // register the user who created
                // wait for players...
                // register a game id
            }

            this.gameDestroy = function(gameName){
                // send to delete the game
                // unregister all players
            }


            this.registerForGame = function(gameName, playerName) {
                // if numbers of player are full, unable to register
                // set listener for game start
            }

            this.unregisterFromGame = function(gameName, playerName) {

            }



            this.userRegister = function(playerName) {
                // var gameSession = Math.floor(Math.random() * 100);
                SocketService.send('register', playerName);
            }

            this.userUnregister = function(playerName) {
                // var gameSession = Math.floor(Math.random() * 100);
            }


            this.startGame = function(playerName) {
                SocketService.on('gamestart', function(playerName) {
                    console.log(playerName, " registered for the game");
                    callback(data);
                    // $rootScope.$broadcast('newmove', move);
                });
            }








            this.finish = function(callback) {

            }
        }

        return new service();

    }
]);
