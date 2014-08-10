var Bucket = function(bucketConfig) {

    // inherit tiles list
    var that = new scrabble.tilesList();


    that.meta = bucketConfig.meta;
    that.letterSetup = bucketConfig.letterSetup;


    that.generateBucket = function() {
        var config = that.letterSetup;
        if (!(config instanceof Array)) return;

        var arr = [];
        var counter = 0;

        config.forEach(function(letterConfig) {

            // var letterObject = letterConfig;

            for (var i = 0; i < letterConfig.total; i++) {
                var letterObject = {};
                extend(letterObject, letterConfig);
                letterObject.id = counter++;
                arr.push(letterObject);
            }
        });

        that.size = arr.length;
        that.tiles = arr;
    }

    var pickTileOld = that.pickTile;

    that.pickTile = function() {
        return pickTileOld(randomInteger(0, that.getRemaining()));
    }

    that.generateBucket();

    return that;
}

module.exports = Bucket;