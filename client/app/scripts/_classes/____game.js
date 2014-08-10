scrabble.Game = function(id, name, size, languagePackCode, socket) {

    var that = this;

    var playTilesLength = 7;

    var GAME_WAITING_FOR_USERS = 1;
    var GAME_STARTED = 2;
    var GAME_FINISHED = 3;

    var turn = 0;

    that.winnerUser = {};
    var foldCounter;


    that.id = id;
    that.name = name;
    that.users = [];
    that.usernamesArray = [];
    that.state = GAME_WAITING_FOR_USERS;
    that.history = [];
    that.size = parseInt(size);
    that.languagePack = scrabble.langPacks[languagePackCode];




    var shuffle = function(array) {
        var currentIndex = array.length,
            temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
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

    that.totalRegistered = function(){
        return that.users.length;
    }



    that.getUser = function(username) {
        var i = 0;
        var userExists = that.users.some(function(user) {
            i++;
            return user.username === username;
        })

        if (userExists) {
            return that.users[i - 1];
        } else {
            return false;
        }
    }

    that.getUsers = function() {
        return that.users;
    }









    that.registerUser = function(username) {
        var user = that.getUser(username);
        console.log(user);
        if (!user) {
            that.users.push({
                username: username,
                tiles: new scrabble.tilesList();
            });
            that.usernamesArray.push(username);
        }
        return user;
    }

    that.unregisterUser = function(username) {
        var pos = that.users.indexOf(username);
        if (pos > -1) {
            that.users.splice(that.users.indexOf(username), 1);
        } else {
            return false;
        }
    }








    that.start = function() {
        that.state = GAME_STARTED;


        that.board = new scrabble.Board();
        that.bucket = new scrabble.Bucket(that.languagePack);

        // -------- that.send('game:start', 'Game has started.');

        that.users = shuffle(that.users);
        that.playUsers = that.users.slice(0);


        that.users.forEach(function(user) {
            that.sendTiles(playTilesLength, user.username);
        });

        that.giveTurn();
    }

    that.finish = function() {
        that.state = GAME_FINISHED;
        console.log(that.id + ' : game has ended, winner: ', that.winnerUser);
        that.send('game:end', {
            winner: that.winnerUser,
            totalTime: 'total time calculation'
        });
    }





    that.giveTurn = function() {
        if (turn == that.playUsers.length - 1) {
            turn = 0;
        } else {
            turn++;
        }

        var username = that.playUsers[turn].username;

        /* ------
        that.send('game:turn', {
            username: username
        }, false, username);
        */

        return playUsers[turn];
    }





    that.sendTiles = function(num, username) {

        var newTiles = that.bucket.pickTiles(num);
        that.getUser(username).tiles = that.getUser(username).tiles.concat(newTiles);

        // --------- that.send('game:tiles', newTiles, username);
    }




    that.onQuit = function(username, tiles) {

        that.bucket.pushTiles(tiles);

        var pos = that.playUsers.indexOf(username);
        if (pos > -1) {
            that.playUsers.splice(that.playUsers.indexOf(username), 1);
        } else {
            return false;
        }

        /* ------
        that.send('game:quit', {
            username: username
        }, null, username);
        */

        if (that.playUsers.length === 1) {
            that.winnerUser = that.playUsers[0];
            console.log('The Winner is ' + that.winnerUser);
            that.finish();
        } else if (that.playUsers.length === 0) {
            console.log('No winner for this game ');
            that.finish();
        }

    }


    that.removeTiles = function(username, tiles) {
        var userTiles = that.getUser(username).tiles;

        tiles.forEach(function(tile, index) {
            userTiles.pickTile(tile);
        });

    }



    that.onFold = function(username, tiles) {

        /* --------
        that.send('game:fold', {
            username: username
        }, null, username);
        */


        if ((foldCounter++) >= 2 * that.totalRegistered()) {
            that.finish();
            return;
        }

        that.removeTiles(username, tiles);

        var size = tiles.length;
        var remaining = that.bucket.getRemaining();
        if (remaining <= tiles.length) {
            that.bucket.pushTiles(tiles.splice(0, tiles.length - remaining));
        }

        that.sendTiles(size, username);
        that.bucket.pushTiles(tiles);

        return foldCounter;
    }



    that.onNewmove = function(username, rawPlaceholders) {
        // check if is valid word


        var placeholders = [];

        rawPlaceholders.forEach(function(placeholder) {
            placeholders.push(that.board.get(placeholder.x, placeholder.y).receiveTile(placeholder.tile));
            // placeholders.push(new scrabble.Placeholder(placeholder.square, placeholder.x, placeholder.y, placeholder.tile));
        });


        var move = new scrabble.Move(placeholders);

        if (move.isValid(that.board.isEmpty)) {
            // GameFactory.submitMove(move.getRaw());
            var results = move.parse();


            that.board.place(placeholders);

            var bucketRemaining = that.bucket.getRemaining();

            var tiles = [];
            placeholders.forEach(function(placeholder) {
                tiles.pushTile(placeholder.getTile());
            });

            that.removeTiles(username, tiles);


            that.sendTiles(placeholders.length, username);

            foldCounter = 0;

            /* 
            that.send('game:newmove', {
                move: {
                    tilesRemaining: that.bucket.getRemaining(),
                    meta: results,
                    placeholders: move.getRaw()
                }
            }, null, username);
            */

            var user = that.getUser(username);
            if (user.tiles.length === 0 && bucketRemaining === 0) {
                that.winnerUser = user;
                that.finish();
            }

            that.giveTurn();

        } else {

            placeholders.forEach(function(placeholder) {
                placeholder.removeTile();
            });

            /* ------
            that.send('game:word_not_exists', {
                move: {
                    placeholders: move.getRaw()
                }
            }, username);
            */
        }

    }




    that.getRaw = function() {
        return {
            id: that.id,
            name: that.name,
            users: that.users,
            turn: turn,
            size: that.size,
            state: that.state,
            languagePack: languagePackCode
        }
    }
}
