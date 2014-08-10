'use strict';

// var express = require('express'),
//     employees = require('./routes/employee'),
//     words = require('./routes/words');

// var app = express();

// app.get('/employees/:id/reports', employees.findByManager);
// app.get('/employees/:id', employees.findById);
// app.get('/employees', employees.findAll);

// app.listen(3000);
// console.log('Listening on port 3000...');


// var express = require('express');

// var app = express();
// var http = require('http').Server(app);
// var io = require('socket.io')(http);


// app.get('/')

// app.get('/', function(req, res){
//   res.sendfile('index.html');
// });

// io.on('connection', function(socket){
//   socket.on('chat message', function(msg){
//     io.emit('chat message', msg);
//   });
// });

// http.listen(3000, function(){
//   console.log('listening on *:3000');
// });


// var WebSocketServer = require('websocket').server;
// wsServer = new WebSocketServer({
//     httpServer: server
// });








// http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/


// Optional. You will see this name in eg. 'ps' or 'top' command
// process.title = 'node-chat';

var serverPort = 3000;

var http = require('http');





var server = http.createServer(function(request, response) {
    // process HTTP request. Since we're writing just WebSockets server
    // we don't have to implement anything.
});
server.listen(serverPort, function() {});

// create the server

var scrabble = require('./scrabble/scrabble.module.js');


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





    that.onClose = function(connection){
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



var GamesManager = function() {


    var GAME_WAITING_FOR_USERS = 1;
    var GAME_STARTED = 2;
    var GAME_FINISHED = 3;

    var that = this;


    that.wss = new GamesSocket();

    that.games = {};

    var guid = function() {
        return 'a' + Math.floor(Math.random() * 100000).toString();
    }

    var generateGameId = function() {
        var id = guid();
        while (that.games[id]) {
            id = guid();
        }
        return id;
    }

    that.getRaw = function() {
        var obj = {};
        for (var property in that.games) {
            if (that.games.hasOwnProperty(property)) {
                obj[property] = that.games[property].getRaw();
            }
        }
        return obj;
    }

    that.getGames = function(gameId) {
        return that.games;
    }

    that.getGame = function(gameId) {
        return that.games[gameId];
    }

    that.createGame = function(name, totalPlayers, languagePack) {
        var id = generateGameId();
        that.games[id] = new Game(id, name, totalPlayers, languagePack, that.wss);

        console.log(id);
        return that.games[id];
    }

    that.removeGame = function(gameId) {
        delete that.games[gameId];
    }

    that.listen = function(httpServer, port) {
        that.wss.init(httpServer, port);
    }


    var registerUserForGame = function(username, gameId) {

        var game = that.getGame(gameId);


        if (game && game.state === GAME_WAITING_FOR_USERS) {
            var registeredUser = game.register(username);
            console.log(registeredUser);
            if (registeredUser) {
                that.wss.broadcast('game:register', {
                    username: username,
                    gameId: gameId
                });

                if (game.totalRegistered() >= game.getSize()) {
                    console.log('start....')
                    game.start();
                }
            }

        }
    }


    that.wss.on('game:all', function(connection, data) {
        that.wss.send(connection, 'game:all', {
            data: that.getRaw()
        });
    });



    that.wss.onUserMessage('game:new', function(username, data) {
        console.log('game:new', data)
        var newGame = that.createGame(data.name, data.players, data.languagePack);
        // newGame.register(username);

        that.wss.broadcast('game:new', {
            username: username,
            data: newGame.getRaw()
        });
        registerUserForGame(username, newGame.id);
    });

    that.wss.onUserMessage('game:delete', function(username, data) {

        that.removeGame(data.gameId);

        that.wss.broadcast('game:delete', {
            username: username,
            gameId: data.gameId
        });
    });




    that.wss.onGameMessage('game:register', function(gameId, username, data) {

        registerUserForGame(username, gameId);

    });


    that.wss.onGameMessage('game:unregister', function(gameId, username, data) {
        var game = that.getGame(gameId);
        game.unregister(username);

        that.wss.broadcast('game:unregister', {
            username: username,
            gameId: gameId
        });

        if (game.isEmpty()) {
            that.removeGame(gameId);
            that.wss.broadcast('game:delete', {
                username: username,
                gameId: gameId
            });
        }
    });




    that.wss.onGameMessage('game:newmove', function(gameId, username, data) {
        that.getGame(gameId).onNewmove(username, data);
    });


    that.wss.onGameMessage('game:fold', function(gameId, username, data) {
        that.getGame(gameId).onFold(username, data);
    });

    that.wss.onGameMessage('game:quit', function(gameId, username, data) {
        that.getGame(gameId).onQuit(username, data);
    });

}




var Game = function(id, name, totalPlayers, languagePack, socket) {

    var that = this;

    var playTilesLength = 7;

    var GAME_WAITING_FOR_USERS = 1;
    var GAME_STARTED = 2;
    var GAME_FINISHED = 3;

    var turn = 0;

    that.winnerUser = {};
    var foldCounter;

    this.state = GAME_WAITING_FOR_USERS;

    this.id = id;
    this.name = name;
    this.users = [];
    this.usernamesArray = [];
    this.history = [];
    this.size = parseInt(totalPlayers);
    this.languagePack = languagePack;

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


    this.isEmpty = function() {
        return that.users.length === 0;
    }

    that.totalRegistered = function() {
        return that.users.length;
    }



    this.getSize = function() {
        return this.size;
    }

    this.getUser = function(username) {
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

    this.getUsers = function() {
        return that.users;
    }

    this.register = function(username) {
        var user = that.getUser(username);
        console.log(user);
        if (!user) {
            var index = that.users.push({
                username: username,
                tiles: []
            });
            that.usernamesArray.push(username);
            return that.users[index - 1];
        }
        return false;
    }

    this.unregister = function(username) {
        var pos = that.users.indexOf(username);
        if (pos > -1) {
            that.users.splice(that.users.indexOf(username), 1);
        } else {
            return false;
        }
    }




    this.quit = function(username) {
        var pos = that.playUsers.indexOf(that.getUser(username));
        if (pos > -1) {
            that.playUsers.splice(pos, 1);
        } else {
            return false;
        }
    }

    var findLanguagePack = function(code) {
        // return scrabble.langPacks[code] || scrabble.langPacks['el'];
        return scrabble.langPacks[code];
    }

    this.start = function() {
        this.state = GAME_STARTED;


        this.board = new scrabble.Board();
        this.bucket = new scrabble.Bucket(findLanguagePack(languagePack));

        that.send('game:start', 'Game has started.');

        that.users = shuffle(that.users);
        that.playUsers = that.users.slice(0);


        that.users.forEach(function(user) {
            that.sendTiles(playTilesLength, user.username);
        });
        that.giveTurn();
    }

    this.giveTurn = function() {
        if (turn == that.playUsers.length - 1) {
            turn = 0;
        } else {
            turn++;
        }
        var username = that.playUsers[turn].username;
        that.send('game:turn', {
            username: username
        }, false, username);
    }

    this.finish = function() {
        this.state = FINISHED;
    }

    this.send = function(event, data, toUser, fromUser) {

        var content = {
            gameId: that.id,
            data: data || {}
        };

        if (fromUser) {
            content.username = fromUser;
        }

        if (toUser) {
            socket.sendToUser(toUser, event, content);
        } else {
            socket.sendToUsers(that.usernamesArray, event, content);
        }
    }


    this.sendTiles = function(num, username) {

        var newTiles = that.bucket.pickTiles(num);
        that.getUser(username).tiles = that.getUser(username).tiles.concat(newTiles);

        console.log(that.getUser(username));

        that.send('game:tiles', newTiles, username, username);
    }



    this.endOfGame = function() {
        that.state = GAME_FINISHED;
        console.log(that.id + ' : game has ended, winner: ', that.winnerUser);
        that.send('game:end', {
            winner: that.winnerUser,
            totalTime: 'total time calculation'
        });
    }


    this.onQuit = function(username, tiles) {
        that.bucket.pushTiles(tiles);



        that.quit(username);

        console.log(username, that.playUsers);

        that.send('game:quit', {
            username: username
        }, null, username);


        if (that.playUsers.length === 1) {
            that.winnerUser = that.playUsers[0];
            console.log('The Winner is ' + that.winnerUser);
            that.endOfGame();
        } else if (that.playUsers.length === 0) {
            console.log('No winner for this game ');
            that.endOfGame();
        }

    }


    var removeTiles = function(username, tiles) {
        var curTiles = that.getUser(username).tiles;
        tiles.forEach(function(tile, index) {
            curTiles.some(function(tl, index) {
                if (tl.id === tile.id) {
                    curTiles.splice(index, 1);
                    return true;
                }
            });
        });
    }



    this.onFold = function(username, tiles) {
        that.send('game:fold', {
            username: username
        }, null, username);



        if (foldCounter++ >= 2 * that.totalRegistered()) {
            that.endOfGame();
            return;
        }


        removeTiles(username, tiles);

        var size = tiles.length;
        var remaining = that.bucket.getRemaining();
        if (remaining <= tiles.length) {
            that.bucket.pushTiles(tiles.splice(0, tiles.length - remaining));
        }

        that.sendTiles(size, username);
        that.bucket.pushTiles(tiles);

        that.giveTurn();

    }


    this.onNewmove = function(username, rawPlaceholders) {
        // check if is valid word

        var results;
        var placeholders = [];

        rawPlaceholders.forEach(function(placeholder) {
            placeholders.push(that.board.get(placeholder.x, placeholder.y).receiveTile(placeholder.tile));
            // placeholders.push(new scrabble.Placeholder(placeholder.square, placeholder.x, placeholder.y, placeholder.tile));
        });

        console.log('PLACEHOLDERSSSS', rawPlaceholders, move);

        var move = new scrabble.Move(placeholders);



        if (move.isValid(that.board.isEmpty)) {
            // GameFactory.submitMove(move.getRaw());
            results = move.parse();


            that.board.place(placeholders);

            var bucketRemaining = that.bucket.getRemaining();

            var tiles = [];
            placeholders.forEach(function(placeholder) {
                tiles.push(placeholder.getTile());
            });

            removeTiles(username, tiles);


            that.sendTiles(placeholders.length, username);

            foldCounter = 0;

            that.send('game:newmove', {
                tilesRemaining: that.bucket.getRemaining(),
                meta: results,
                placeholders: move.getRaw()
            }, null, username);



            if (that.getUser(username).tiles.length === 0 && bucketRemaining === 0) {
                that.winnerUser = that.getUser(username);
                that.endOfGame();
                return;
            }

            that.giveTurn();

        } else {

            placeholders.forEach(function(placeholder) {
                placeholder.removeTile();
            });

            that.send('game:word_not_exists', {
                placeholders: move.getRaw()

            }, username);
        }

    }




    this.getRaw = function() {
        return {
            id: that.id,
            name: that.name,
            users: that.users,
            turn: turn,
            size: that.size,
            state: that.state,
            languagePack: that.languagePack
        }
    }

}





var manager = new GamesManager();
manager.listen(server, serverPort);
