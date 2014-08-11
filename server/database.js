'use strict';

function dbConnection() {

    var that = this;

    var MongoClient = require('mongodb').MongoClient;
    that.dbReady = false;
    that.db;

    var connectionString = 'mongodb://jimkast:#j19851987#@ds053449.mongolab.com:53449/scrabblejs';


    that.findWord = function(q, language, callback) {

        var collection = db.collection(language);
        collection.findOne({
            word: q
        }, function(err, item) {
            // response.jsonp(item);
            callback(item);
        });
    };



    that.findWords = function(wordsArray, language, callback) {

        var regex = new RegExp('^(' + wordsArray.join('|') + ')$', 'i');
        // var regex = new RegExp('^(' + ['aba', 'abau', 'sdfdsf'].join('|') + ')$', 'i');

        var collection = that.db.collection(language);
        collection.find({
            word: regex
        }).limit(wordsArray.length).toArray(callback);
    };




    that.connect = function() {
        MongoClient.connect(connectionString, function(err, database) {
            if (err) throw database;

            that.dbReady = true;
            that.db = database;
            console.log('Connected to database...');

        });
    }


}

module.exports = dbConnection;