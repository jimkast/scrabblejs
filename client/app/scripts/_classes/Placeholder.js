scrabble.Placeholder = function(square, tile) {

    var that = this;

    that.square = square;
    that.tile = tile;


    
    that.getTile = function() {
        return that.tile;
    }
    
    that.receiveTile = function(tile) {
        that.tile = tile;
        return that;
    }

    that.placeTile = function() {
        that.placed = true;
        return that;
    }

    that.removeTile = function() {
        var tile = that.tile;
        delete that.tile;
        return tile;
    }




    that.isPlaced = function() {
        return that.placed && that.tile;
    }

    that.isFilled = function() {
        if (that.tile) return true;
        return false;
    }

    that.isEmpty = function() {
        return !that.isFilled();
    }


    that.isPlayHolder = function() {
        return !that.placed && that.tile;
    }


    


    that.getType = function() {
        return that.square;
    }

    that.setType = function(square) {
        that.square = square;
    }


    that.getRaw = function() {
        return {
            square: square.getRaw(),
            tile: that.tile
        }
    }


    // TO BE REMOVED
    that.getLetter = function() {
        return that.getTile().letter;
    }


    // TO BE REMOVED
    that.getPoints = function() {
        return that.getTile().points;
    }
}
