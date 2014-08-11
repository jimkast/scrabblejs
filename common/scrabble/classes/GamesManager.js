(function(scrabble) {


    scrabble.GamesManager = function() {

        var GAME_WAITING_FOR_USERS = 1;
        var GAME_STARTED = 2;
        var GAME_FINISHED = 3;

        var that = this;

        that.games = {};


        that.gamesArray = [];


        // var emptyArray = function(A) {
        //     if (A instanceof Array) {
        //         while (A.length > 0) {
        //             A.pop();
        //         }
        //     }
        // }

        var objectToArray = function(obj, arr) {
            if (arr instanceof Array) {
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        arr.push(obj[key]);
                    }
                }
            }
        }


        that.findGameById = function(gameID) {
            var pos = -1;
            that.gamesArray.some(function(game, index) {
                var found = game.id === gameID;
                if (found) {
                    pos = index;
                }
                return found;
            });

            return that.gamesArray[pos];
        }









        var guid = function() {
            return Math.floor(Math.random() * 100000).toString();
        }

        var generateGameId = function() {
            var id = guid();
            while (that.games.id) {
                id = guid();
            }
            return id;
        }



        that.setGames = function(games) {

            for (var key in games) {
                if (games.hasOwnProperty(key)) {
                    that.createGame(games[key]);
                }
            }

            // extend(that.games, games);

            // objectToArray(that.games, that.gamesArray);
        }

        that.getGames = function(gameId) {
            return that.games;
        }

        that.getGame = function(gameId) {
            return that.games[gameId];
        }


        // that.createGame = function(name, totalPlayers, languagePack) {
        //     var id = generateGameId();
        //     that.games[id] = new Game(id, name, totalPlayers, languagePack, that.wss);
        //     return that.games[id];
        // }


        that.createGame = function(game) {
            var newGame = new scrabble.Game(game);
            that.games[game.id] = newGame;


            that.gamesArray.push(newGame);

            return newGame;
        }

        that.deleteGame = function(gameId) {

            that.gamesArray.splice(that.gamesArray.indexOf(that.findGameById(gameId)), 1);

            delete that.games[gameId];
        }



        that.registerUserForGame = function(username, gameId) {
            return that.getGame(gameId).registerUser(username);
        }

        that.unregisterUserFromGame = function(username, gameId) {
            return that.getGame(gameId).unregister(username);
        }



        that.getRaw = function() {
            var arr = [];
            for (var property in that.games) {
                if (that.games.hasOwnProperty(property)) {
                    arr.push(that.games[property].getRaw());
                }
            }
            return arr;
        }



    }

})(typeof global === 'undefined' ? window.scrabble : global.scrabble);
