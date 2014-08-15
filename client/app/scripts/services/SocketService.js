'use strict';

app.service('SocketService', [
    function() {

        var service = function() {

            var that = this;
            var ws;


            var afterCallback;

            that.after = function(callback){
                if(callback) afterCallback = callback;
            }



            var callbackFunctions = {
                error: function() {
                    console.log('SOCKET ERROR');
                },

                open: function() {
                    console.log('SOCKET OPENED');
                },

                close: function() {
                    console.log('SOCKET CLOSED');
                },

                default: function(data) {
                    console.log(data);
                }
            };

            var callback = function(event, data) {
                if (event && typeof callbackFunctions[event] === 'function') {
                    callbackFunctions[event](data);
                } else {
                    callbackFunctions.default(data);
                }
            }

            this.connect = function() {
                if (ws) {
                    console.log('Socket already initialized.')
                    return;
                }

                // ws = new WebSocket("ws://echo.websocket.org");
                ws = new WebSocket("ws://127.0.0.1:3000/");

                ws.onopen = function() {
                    callbackFunctions['open'].call();
                };

                ws.onerror = function() {
                    callbackFunctions['error'].call();
                }

                ws.onmessage = function(socketEvent) {
                    var responseJSON = JSON.parse(socketEvent.data);
                    console.log(responseJSON.event, responseJSON.data, ' <<<--- SOCKET RECEIVED DATA');
                    callback(responseJSON.event, responseJSON.data);

                    if(afterCallback) afterCallback();
                };

                ws.onclose = function(){
                    callbackFunctions['error'].call();
                }
            }


            this.send = function(event, data) {
                // console.log(JSON.stringify(message), 'stringfy');
                var obj = {event: event};
                if(data !== undefined){
                    obj.data = data;
                } 
                ws.send(JSON.stringify(obj));
                console.log(event, obj, ' --->>> SENDING DATA TO SOCKET');
            }

            // registers a new event and its callback function
            this.on = function(event, callback) {
                callbackFunctions[event] = callback;
            }

            this.ajax = function(event, data, callback){
                
            }
        }

        return new service();
    }
]);
