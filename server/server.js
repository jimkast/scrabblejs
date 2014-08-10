'use strict';


var serverPort = 3000;

var http = require('http');





var server = http.createServer(function(request, response) {
    // process HTTP request. Since we're writing just WebSockets server
    // we don't have to implement anything.
});
server.listen(serverPort, function() {});

// create the server

// var scrabble = require('./scrabble/scrabble.module.js');
var scrabble = require('../common/scrabble/scrabble.js');
// var scrabble = require('./scrabble.js');


console.log(scrabble);

/* SOCKET */




var socketExtended = function() {

    var that = this;
    var wss;
    var WebSocketServer = require('websocket').server;

    this.clients = [];
    this.history = [];

    var originIsAllowed = function(origin) {
        return true;
    }


    var callbackFunctions = {};

    var callback = function(connection, requestObject) {
        if (requestObject.event && typeof callbackFunctions[requestObject.event] === 'function') {
            callbackFunctions[requestObject.event](connection, requestObject.data);
            // callbackFunctions[event].apply(this, callbackArgs);
        } else {
            // Default echoes the request message 
            connection.sendUTF(requestObject);
        }
    }



    // registers a callback function for an event message
    this.on = function(event, callback) {
        callbackFunctions[event] = callback;
    }

    this.send = function(connection, event, data) {
        // console.log({
        //     event: event,
        //     data: data
        // });
        connection.sendUTF(JSON.stringify({
            event: event,
            data: data
        }));
    }

    this.broadcast = function(event, data) {
        var data = data || {};
        that.clients.forEach(function(client) {
            that.send(client, event, data);
        });
    }


    this.removeConnection = function(connection) {
        that.clients.splice(that.clients.indexOf(connection), 1);
    }

    this.getConnections = function() {
        return that.clients;
    }

    this.onClose = function() {}

    this.init = function(httpServer, port) {

        wss = new WebSocketServer({
            httpServer: httpServer
        });


        // WebSocket server
        wss.on('request', function(request) {

            console.log((new Date()) + ' Connection request from origin ' + request.origin + ' rejected.');

            if (!originIsAllowed(request.origin)) {
                request.reject();
                console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
                return;
            }

            var connection = request.accept(null, request.origin);
            var index = that.clients.push(connection) - 1;

            console.log((new Date()) + request.origin + ' Connection accepted.');

            that.send(connection, 'connected');

            connection.on('message', function(message) {
                if (message.type === 'utf8') {
                    var requestData = JSON.parse(message.utf8Data);
                    // callback(connection, requestData.event, requestData.data);
                    callback(connection, requestData);
                }
            });

            // user disconnected
            connection.on('close', function(reasonCode, description) {
                console.log((new Date()) + " Peer " + connection.remoteAddress + " disconnected.");
                that.clients.splice(index, 1);
                // that.removeConnection(connection);
                that.onClose(connection);
            });

        });
    }
}







var privateSocket = function() {
    var that = new socketExtended();

    that.users = {};


    var addUser = function(username, connection) {
        that.users[username] = connection;
    }

    var deleteUser = function(username) {
        // that.removeConnection(getConnectionFromUser(username));
        delete that.users[username];
    }

    var userExists = function(username) {
        return that.users[username] !== undefined;
    }

    var getConnectionFromUser = function(username) {
        return that.users[username];
    }

    var getUserFromConnection = function(connection) {
        for (var key in that.users) {
            if (that.users.hasOwnProperty(key)) {
                if (that.users[key] === connection) {
                    return key;
                }
            }
        }
        return false;
    }




    that.getUser = function(username) {
        return that.users[username];
    }

    that.getUsers = function() {
        return that.users;
    }

    that.getRaw = function() {
        var arr = [];
        for (var property in that.users) {
            if (that.users.hasOwnProperty(property)) {
                arr.push(property);
            }
        }
        return arr;
    }





    that.onClose = function(connection) {
        deleteUser(getUserFromConnection(connection));
    };


    that.sendToUser = function(username, event, data) {
        that.send(getConnectionFromUser(username), event, data);
    }

    that.sendToUsers = function(usersArray, event, data) {
        usersArray.forEach(function(username) {
            that.send(getConnectionFromUser(username), event, data);
        });
    }

    that.onUserMessage = function(event, callback) {
        that.on(event, function(connection, requestObject) {
            if (requestObject.username) {
                callback(requestObject.username, requestObject.data);
            } else {
                that.send(connection, event, {
                    code: "UNAUTHORIZED",
                    text: 'Unauthorized call.'
                });
            }
        })
    }


    that.on('user:all', function(connection, data) {
        that.send(connection, 'user:all', that.getRaw());
    });


    that.on('user:register', function(connection, data) {
        var response;
        if (!data.username) {
            response = {
                code: "USERNAME_NOT_SPECIFIED",
                text: 'Username not specified.'
            }
            that.send(connection, 'user:register', response);
        } else if (userExists(data.username)) {
            response = {
                code: "USERNAME_UNIQUE",
                text: 'A user with the same username is already registered.'
            }
            that.send(connection, 'user:register', response);
        } else {
            addUser(data.username, connection);
            response = {
                username: data.username,
                code: true,
                text: 'Successful Registration.'
            }
            // that.send(connection, 'user:register', response);
            that.broadcast('user:register', response);
        }


    });

    that.onUserMessage('user:unregister', function(username, data) {
        deleteUser(username);
        that.broadcast('user:unregister', {
            username: username,
            code: true,
            text: 'Successful Unregistration.'
        });
    });



    return that;
}








var GamesSocket = function() {

    var that = new privateSocket();


    // that.sendToGame = function(gameId, event, data) {
    //     var gameUsers = getGameUsers(gameId);
    //     that.sendToUsers(gameUsers, event, data);
    // }


    // that.sendToGame = function(event, gameId, data, toUser, fromUser) {

    //     var content = {
    //         gameId: that.id,
    //         data: data || {}
    //     };

    //     if (fromUser) {
    //         content.username = fromUser;
    //     }

    //     if (toUser) {
    //         that.sendToUser(toUser, event, content);
    //     } else {
    //         var usernamesArray = [];
    //         game.users.forEach(function(user) {
    //             usernamesArray.push(user.username);
    //         });
    //         that.sendToUsers(usernamesArray, event, content);
    //     }
    // }



    that.onGameMessage = function(event, callback) {
        that.on(event, function(connection, requestObject) {
            if (requestObject.gameId) {
                callback(requestObject.gameId, requestObject.username, requestObject.data);
            } else {
                that.send(connection, {
                    code: "NO GAME SPECIFIED",
                    text: 'No game specified.'
                });
            }
        })
    }


    return that;
}







var GamesServer = function() {

    var that = this;

    var GamesManager = new scrabble.GamesManager();


    var GAME_WAITING_FOR_USERS = 1;

    var wss = new GamesSocket();


    var guid = function() {
        return Math.floor(Math.random() * 100000).toString();
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


    var initGame = function(name, size, languagePack) {
        return {
            id: generateGameId(),
            name: name,
            size: size,
            languagePack: languagePack,
            state: GAME_WAITING_FOR_USERS
        };
    }

    var registerUserForGame = function(username, gameId) {
        var game = GamesManager.getGame(gameId);

        if (game && game.state === GAME_WAITING_FOR_USERS) {
            var registeredUser = game.registerUser(username);
            if (registeredUser) {

                wss.broadcast('game:register', {
                    username: username,
                    gameId: gameId
                });

                if (game.totalRegistered() >= game.getSize()) {
                    console.log('start....')

                    game.users = shuffle(game.users);

                    game.start();

                    game.send('game:start', 'Game has started.');

                    game.users.forEach(function(user) {
                        game.send('game:tiles', game.sendTiles(user.username, game.getTilesFromBucket(7)), user.username, user.username);
                    });


                    game.giveTurn();
                }
            }
        }
    }


    var unregisterUserFromGame = function(username, gameId) {
        var game = GamesManager.getGame(gameId);
        game.unregister(username);

        wss.broadcast('game:unregister', {
            username: username,
            gameId: gameId
        });

        if (game.isEmpty()) {

            GamesManager.deleteGame(gameId);
            wss.broadcast('game:delete', {
                username: username,
                gameId: gameId
            });
        }
    }



    var sendFinishMessage = function(game) {
        game.send('game:end', {
            winner: game.winnerUser,
            totalTime: 'total time calculation'
        });
    }








    wss.on('game:all', function(connection, data) {
        wss.send(connection, 'game:all', {
            data: GamesManager.getRaw()
        });
    });




    wss.onUserMessage('game:new', function(username, data) {

        var newGameRaw = initGame(data.name, data.players, data.languagePack);
        var game = GamesManager.createGame(newGameRaw);


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

        game.giveTurn = function() {
            if (game.turn == game.playUsers.length - 1) {
                game.turn = 0;
            } else {
                game.turn++;
            }
            var username = game.playUsers[game.turn].username;

            game.send('game:turn', {
                username: username
            }, false, username);
        }


        // newGame.register(username);



        wss.broadcast('game:new', {
            username: username,
            data: newGameRaw
        });

        registerUserForGame(username, newGameRaw.id);
    });

    wss.onUserMessage('game:delete', function(username, data) {

        GamesManager.deleteGame(data.gameId);

        wss.broadcast('game:delete', {
            username: username,
            gameId: data.gameId
        });
    });






    wss.onGameMessage('game:register', function(gameId, username) {
        registerUserForGame(username, gameId);
    });

    wss.onGameMessage('game:unregister', function(gameId, username, data) {
        unregisterUserFromGame(username, gameId);
    });






    wss.onGameMessage('game:newmove', function(gameId, username, rawPlaceholders) {
        // check if is valid word

        var game = GamesManager.getGame(gameId);

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

            game.board.place(placeholders);

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
            game.giveTurn();



        } else {

            placeholders.forEach(function(placeholder) {
                placeholder.removeTile();
            });

            wss.gameId(gameId, 'game:word_not_exists', {
                placeholders: move.getRaw()
            }, username);
        }
    });


    wss.onGameMessage('game:fold', function(gameId, username, tiles) {

        var game = GamesManager.getGame(gameId);

        game.send('game:fold', {
            username: username
        }, null, username);



        if ((game.foldCounter++) >= 2 * game.totalRegistered()) {
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

        game.giveTurn();

    });


    wss.onGameMessage('game:quit', function(gameId, username, tiles) {

        var game = GamesManager.getGame(gameId);

        game.quit(username, tiles);

        wss.gameId(gameId, 'game:quit', {
            username: username
        }, null, username);


        if (game.playUsers.length === 1) {

            game.finish(game.playUsers[0]);
            sendFinishMessage(game);

        } else if (that.playUsers.length === 0) {

            game.finish(null);
            sendFinishMessage(game);
        }

    });



}




var ServerInterface = function() {

}




var manager = new GamesServer();
manager.listen(server, serverPort);
