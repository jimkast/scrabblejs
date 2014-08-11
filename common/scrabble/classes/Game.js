(function(scrabble) {

    scrabble.Game = function(currentState) {




        var that = this;

        var playTilesLength = 7;

        var GAME_WAITING_FOR_USERS = 1;
        var GAME_STARTED = 2;
        var GAME_FINISHED = 3;

        that.turn = 0;

        that.foldCounter = 0;



        var options = {
            id: 1,
            name: 'noname',
            size: 1,
            languagePackCode: 'el',
            state: GAME_WAITING_FOR_USERS,
            users: [],
            playUsers: [],
            history: [],
            winnerUser: {},
            bucketRemaining: 0,
            registered: false
        }


        extend(options, currentState);
        extend(that, options);


        that.size = parseInt(that.size);
        that.languagePack = scrabble.langPacks[that.languagePackCode];





        that.getTilesFromBucket = function(num) {
            return that.bucket.pickTiles(num);
        }

        that.getUsernames = function() {
            var usernamesArray = [];
            that.users.forEach(function(user) {
                usernamesArray.push(user.username);
            });
            return usernamesArray;
        }

        that.userIsPlaying = function(username) {
            return that.users.some(function(user) {
                return user.username === username;
            })
        }


        that.setBucketRemaining = function(remaining) {
            that.bucketRemaining = remaining;
        }




        that.getSize = function() {
            return that.size;
        }

        that.setSize = function(size) {
            that.size = parseInt(size);
        }



        that.isEmpty = function() {
            return that.users.length === 0;
        }

        that.totalRegistered = function() {
            return that.users.length;
        }


        that.totalPlaying = function() {
            return that.playUsers.length;
        }



        that.getUser = function(username) {
            var i = 0;
            var userExists = that.users.some(function(user, index) {
                found = user.username === username;
                if (found) {
                    i = index;
                }
                return found;
            })

            if (userExists) {
                return that.users[i];
            } else {
                return false;
            }
        }

        that.getUsers = function() {
            return that.users;
        }


        that.getPlayingUser = function() {
            var i = 0;
            var userExists = that.users.some(function(user, index) {
                found = user.isPlaying === true;
                if (found) {
                    i = index;
                }
                return found;
            })

            if (userExists) {
                return that.users[i];
            } else {
                return false;
            }
        }






        that.registerUser = function(username) {
            var user = that.getUser(username);
            if (!user) {
                var index = that.users.push({
                    username: username,
                    tiles: new scrabble.tilesList()
                });
                // that.usernamesArray.push(username);
                return that.users[index - 1];
            }
            return false;
        }

        that.unregisterUser = function(username) {
            var pos = that.users.indexOf(username);
            if (pos > -1) {
                that.users.splice(that.users.indexOf(username), 1);
            } else {
                return false;
            }
        }





        that.board = new scrabble.Board();



        that.start = function() {
            that.state = GAME_STARTED;


            // that.board = new scrabble.Board();
            if (that.languagePack) {
                that.bucket = new scrabble.Bucket(that.languagePack);
            }

            // -------- that.send('game:start', 'Game has started.');

            // that.users = shuffle(that.users);
            that.playUsers = that.users.slice(0);


            // that.users.forEach(function(user) {
            //     that.sendTiles(playTilesLength, user.username);
            // });

            // that.giveTurn();
        }

        that.finish = function(winner) {
            that.state = GAME_FINISHED;

            if (winner) {
                that.winnerUser = winner;
            }

        }



        // that.giveTurn = function(turn) {
        //     that.playUsers[that.turn].isPlaying = false;
        //     that.playUsers[turn].isPlaying = true;

        //     that.turn = turn;
        // }


        that.giveTurn = function(username) {
            that.getPlayingUser().isPlaying = false;
            that.getUser(username).isPlaying = true;
        }


        that.sendTiles = function(username, newTiles) {
            that.getUser(username).tiles.pushTiles(newTiles);
            return newTiles;
        }

        that.stopUser = function(username) {
            var pos = that.playUsers.indexOf(that.getUser(username));
            if (pos > -1) {
                that.playUsers.splice(pos, 1);
            } else {
                return false;
            }
        }


        that.quit = function(username, tiles) {

            that.bucket.pushTiles(tiles);

            that.stopUser(username);

            if (that.playUsers.length === 1) {
                var winner = that.playUsers[0];
                that.finish(winner);
            } else if (that.playUsers.length === 0) {
                that.finish();
            }

        }


        that.fold = function(username, tiles) {


            // that.removeTiles(username, tiles);


            // if ((that.foldCounter++) >= 2 * that.totalRegistered()) {
            //     that.finish();
            //     return;
            // }



            // var size = tiles.length;
            // var bucketRemaining = that.bucket.getRemaining();
            // var userTilesRemaining = that.getUser(username).tiles.getRemaining();
            // if (bucketRemaining <= userTilesRemaining) {
            //     that.bucket.pushTiles(tiles.pickTiles(userTilesRemaining - bucketRemaining));
            // }

            // that.sendTiles(size, username);
            // that.bucket.pushTiles(tiles);

            // return that.foldCounter;
        }


        that.placeSuccessfulMove = function(rawPlaceholders) {
            var placeholders = [];

            rawPlaceholders.forEach(function(placeholder) {
                placeholders.push(that.board.get(placeholder.x, placeholder.y).receiveTile(placeholder.tile));

                // placeholders.push(new scrabble.Placeholder(placeholder.square, placeholder.x, placeholder.y, placeholder.tile));
            });

            var move = new scrabble.Move(placeholders);


            // var results = move.parse();

            that.board.place(placeholders);

            that.foldCounter = 0;



            // var user = that.getUser(username);
            // if (user.tiles.getRemaining() === 0 && that.bucket.getRemaining() === 0) {
            //     var winner = user;
            //     that.finish(winner);
            // } else {
            //     that.giveTurn();
            // }

        }



        that.removeTiles = function(username, tiles) {
            if (!(tiles instanceof Array)) return;

            var userTiles = that.getUser(username).tiles;

            tiles.forEach(function(tile, index) {
                userTiles.pickTile(tile);
            });

        }


        that.getRaw = function(userFilter) {

            var filteredUsers;

            if (userFilter) {
                filteredUsers = [];
                that.users.forEach(function(user, index) {
                    filteredUsers.push(extend({}, user));
                    var emptyTilesList = new scrabble.tilesList();
                    filteredUsers[index].tiles = emptyTilesList;
                });
            } else {
                filteredUsers = that.users;
            }

            return {
                id: that.id,
                name: that.name,
                users: filteredUsers,
                playUsers: that.playUsers,
                turn: that.turn,
                size: that.size,
                state: that.state,
                history: that.history,
                languagePack: that.languagePackCode,
                winnerUser: that.winnerUser,
                bucketRemaining: that.bucketRemaining,

            }
        }
    }


})(typeof global === 'undefined' ? window.scrabble : global.scrabble);
