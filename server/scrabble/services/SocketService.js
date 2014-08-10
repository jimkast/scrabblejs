
app.factory('SocketService', function() {

    var service = function() {

        var that = this;
        var ws;

        var callbackFunctions = {
            error: function() {
                console.log('SOCKET ERROR');
            },

            open: function() {
                console.log('SOCKET OPENED');
            },

            default: function(data) {
                console.log(data);
            }
        };

        var callback = function(event, data) {
            if (event) {
                callbackFunctions[event](data);
            } else {
                callbackFunctions.default();
            }
        }

        this.connect = function() {
            if (service.ws) {
                return;
            }

            // ws = new WebSocket("ws://echo.websocket.org");
            ws = new WebSocket("ws://localhost:3000/");

            ws.onopen = function() {
                callbackFunctions['open'].call();
            };

            ws.onerror = function() {
                callbackFunctions['error'].call();
            }

            ws.onmessage = function(message) {
                console.log(message);
                var response = JSON.parse(message.data);
                callback(response.event, response.data);
            };
        }


        this.send = function(event, data) {
            // console.log(JSON.stringify(message), 'stringfy');
            ws.send(JSON.stringify({
                event: event,
                data: data
            }));
        }

        // registers a new event and its callback function
        this.on = function(event, callback) {
            callbackFunctions[event] = callback;
        }
    }

    return new service();
});

