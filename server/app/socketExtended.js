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

            console.log(request.cookies);

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



// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}


module.exports = socketExtended;