var GamesServer = function() {


    var MongoConnection = require('./databaseWords.js');

    var mongo = new MongoConnection();

    mongo.connect(function() {



    });

    var that = this;

    var privateSocket = require('./privateSocket.js');


    var GamesManager = new scrabble.GamesManager();

    var wss = new privateSocket();


    var arraysDiff = function(array1, array2) {
        return array1.filter(function(item) {
            return array2.indexOf(item) < 0;
        });
    };


    wss.onGameMessage = function(event, callback) {

        wss.onUserMessage(event, function(username, data, requestObject) {
            if (requestObject.gameId) {
                var game = GamesManager.getGame(requestObject.gameId);
                if (game) {
                    callback(game, username, data);
                }
            } else {
                wss.sendToUser(username, {
                    code: "NO GAME SPECIFIED",
                    text: 'No game specified.'
                });
            }
        })

    }


    var guid = function() {
        return Math.floor(Math.random() * 1000000).toString();
    }

    var generateGameId = function() {
        var id = guid();
        while (GamesManager.games.id) {
            id = guid();
        }
        return id;
    }


    that.listen = function(httpServer, port) {
        wss.init(httpServer, port);
    }




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


    var initGame = function(name, size, languagePackCode) {
        return {
            id: generateGameId(),
            name: name,
            size: size,
            languagePackCode: languagePackCode
        };
    }

    var registerUserForGame = function(username, game) {

        var registeredUser = game.registerUser(username);
        if (registeredUser) {

            wss.broadcast('game:register', {
                username: username,
                gameId: game.id
            });

            if (game.totalRegistered() >= game.getSize()) {
                console.log('start....');

                game.users = shuffle(game.users);

                game.start();

                game.send('game:start', 'Game has started.');

                game.users.forEach(function(user) {
                    game.send('game:tiles', game.sendTiles(user.username, game.getTilesFromBucket(7)), user.username, user.username);
                });


                game.setTurn();
            }
        }
    }



    var unregisterUserFromGame = function(username, game) {
        game.unregister(username);

        wss.broadcast('game:unregister', {
            username: username,
            gameId: game.id
        });

        if (game.isEmpty()) {

            GamesManager.deleteGame(game.id);
            wss.broadcast('game:delete', {
                username: username,
                gameId: game.id
            });
        }
    }



    var sendFinishMessage = function(game) {
        game.send('game:end', {
            winner: game.winnerUser,
            totalTime: 'total time calculation'
        });
    }









    // REQUEST OF ALL GAMES LIST
    wss.on('game:all', function(connection, data) {
        wss.send(connection, 'game:all', {
            data: GamesManager.getRaw()
        });
    });





    // NEW GAME CREATE REQUEST
    wss.onUserMessage('game:new', function(username, data) {

        var newGameRaw = initGame(data.name, data.players, data.languagePackCode);

        console.log(newGameRaw, 'raw');

        var game = GamesManager.createGame(newGameRaw);



        // Extend game with new helpoer functions 
        game.send = function(event, data, toUser, fromUser) {

            var content = {
                gameId: game.id,
                data: data || {}
            };

            if (fromUser) {
                content.username = fromUser;
            }

            if (toUser) {
                wss.sendToUser(toUser, event, content);
            } else {
                wss.sendToUsers(game.getUsernames(), event, content);
            }
        }


        game.turn = 0;

        game.setTurn = function() {
            if (game.turn == game.playUsers.length - 1) {
                game.turn = 0;
            } else {
                game.turn++;
            }
            var username = game.playUsers[game.turn].username;

            game.giveTurn(username);

            game.send('game:turn', {
                username: username
            }, false, username);
        }


        // newGame.register(username);


        wss.broadcast('game:new', {
            username: username,
            data: newGameRaw
        });

        registerUserForGame(username, game);
    });





    // DELETE GAME REQUEST
    wss.onGameMessage('game:delete', function(game, username) {

        GamesManager.deleteGame(game.id);

        wss.broadcast('game:delete', {
            username: username,
            gameId: game.id
        });
    });




    // REGISTER USER FOR A GAME REQUEST
    wss.onGameMessage('game:register', function(game, username) {
        registerUserForGame(username, game);
    });



    // UNREGISTER A USER FROM GAME REQUEST
    wss.onGameMessage('game:unregister', function(game, username, data) {
        unregisterUserFromGame(username, game);
    });





    // NEW MOVE SUBMITTED FROM USER
    wss.onGameMessage('game:newmove', function(game, username, rawPlaceholders) {
        // check if is valid word

        if (!game.getUser(username).isPlaying) {
            return false;
        }

        var results;
        var placeholders = [];

        rawPlaceholders.forEach(function(placeholder) {
            placeholders.push(game.board.get(placeholder.x, placeholder.y).receiveTile(placeholder.tile));
            // placeholders.push(new scrabble.Placeholder(placeholder.square, placeholder.x, placeholder.y, placeholder.tile));
        });


        var move = new scrabble.Move(placeholders);


        if (move.isValid(game.board.isEmpty)) {
            // GameFactory.submitMove(move.getRaw());

            var tiles = [];

            results = move.parse();

            var wordsPlayed = [];
            results.forEach(function(result) {
                wordsPlayed.push(result.string);
            });


            mongo.findWords(wordsPlayed, game.languagePackCode, function(error, items) {

                var wordsFound = [];
                items.forEach(function(item) {
                    wordsFound.push(item.word);
                });


                if (wordsFound.length === wordsPlayed.length) {


                    game.placeSuccessfulMove(rawPlaceholders);

                    var bucketRemaining = game.bucket.getRemaining();

                    placeholders.forEach(function(placeholder) {
                        tiles.push(placeholder.getTile());
                    });

                    game.removeTiles(username, tiles);


                    game.foldCounter = 0;

                    game.send('game:newmove', {
                        tilesRemaining: game.bucket.getRemaining(),
                        meta: results,
                        placeholders: move.getRaw()
                    }, null, username);



                    if (game.getUser(username).tiles.getRemaining() === 0 && bucketRemaining === 0) {

                        game.stopUser(username);

                        if (game.playUsers.length === 1) {
                            game.finish(game.getUser(username));
                            sendFinishMessage(game);
                            return;
                        } else if (game.playUsers.length === 0) {
                            game.finish(null);
                            sendFinishMessage(game);
                            return;
                        }
                    }

                    game.send('game:tiles', game.sendTiles(username, game.getTilesFromBucket(placeholders.length)), username, username);
                    game.setTurn();

                } else {

                    placeholders.forEach(function(placeholder) {
                        placeholder.removeTile();
                    });

                    var notExistedWords = arraysDiff(wordsPlayed, wordsFound);
                    console.log('WRONG MOVEEEE', notExistedWords);

                    game.send('game:words_not_exist', notExistedWords, username, username);
                }


                console.log(wordsFound, ' --- words test results --- ', wordsPlayed);


            });



        } else {

            placeholders.forEach(function(placeholder) {
                placeholder.removeTile();
            });

            game.send('game:invalid_move', {
                placeholders: move.getRaw()
            }, username, username);
        }
    });



    // USER FOLDED
    wss.onGameMessage('game:fold', function(game, username, tiles) {

        game.send('game:fold', {
            username: username
        }, null, username);



        if ((++game.foldCounter) >= 2 * game.totalPlaying()) {
            game.finish(game.getUser(username));

            sendFinishMessage(game);

            return;
        }


        game.removeTiles(username, tiles);

        var size = tiles.length;
        var remaining = game.bucket.getRemaining();
        if (remaining <= tiles.length) {
            game.bucket.pushTiles(tiles.splice(0, tiles.length - remaining));
        }

        game.send('game:tiles', game.sendTiles(username, game.getTilesFromBucket(size)), username, username);


        game.bucket.pushTiles(tiles);

        game.setTurn();

    });




    // USER QUITTED FROM GAME
    wss.onGameMessage('game:quit', function(game, username, tiles) {

        game.quit(username, tiles);

        game.send('game:quit', {}, null, username);

        if (game.playUsers.length === 1 || game.playUsers.length === 0) {

            game.finish(game.playUsers[0]);
            sendFinishMessage(game);

        }

    });




}

module.exports = GamesServer;
