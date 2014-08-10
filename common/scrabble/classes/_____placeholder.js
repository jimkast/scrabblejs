scrabble.Placeholder = function(square, x, y, tile) {

    this.square = square;
    this.x = x;
    this.y = y;
    this.tile = tile;

    var that = this;

    this.receiveTile = function(tile) {
        this.tile = tile;
        return this;
    }

    this.placeTile = function() {
        this.placed = true;
        return this;
    }

    this.removeTile = function() {
        var tile = this.tile;
        delete this.tile;
        return tile;
    }

    this.prev = function(direction) {
        if (direction === scrabble.constants.DIR_VERTICAL) return this.top;
        else return this.left;
    }

    this.next = function(direction) {
        if (direction === scrabble.constants.DIR_VERTICAL) return this.bottom;
        else return this.right;
    }

    var getNeighbours = function(checkFunction) {
        var neighbours = [];
        var arr = [that.top, that.right, that.bottom, that.left];
        arr.forEach(function(placeholder) {
            if (placeholder && checkFunction(placeholder)) {
                neighbours.push(placeholder);
            }
        });
        return neighbours;
    }

    this.getAllNeightbours = function() {
        return getNeighbours(function() {
            return true;
        });
    }

    this.getPlacedNeighbours = function() {
        return getNeighbours(function(placeholder) {
            return placeholder.isPlaced();
        });
    }

    this.getEmptyNeighbours = function() {
        return getNeighbours(function(placeholder) {
            return placeholder.isEmpty();
        });
    }

    this.hasPlacedNeighbours = function() {
        return this.getPlacedNeighbours().length > 0;
    }

    this.hasEmptyNeighBours = function() {
        return this.getEmptyNeighbours().length === 4;
    }

    this.isPlayHolder = function() {
        return !this.placed && this.tile;
    }

    this.isPlaced = function() {
        return this.placed && this.tile;
    }

    this.isFilled = function() {
        if (this.tile) return true;
        return false;
    }

    this.isEmpty = function() {
        return !this.isFilled();
    }

    this.getTile = function() {
        return this.tile;
    }

    this.setTile = function(tile) {
        this.tile = tile;
    }

    this.getType = function() {
        return this.square;
    }

    this.setType = function(square) {
        this.square = square;
    }

    this.getLetter = function() {
        return this.getTile().letter;
    }

    this.getRow = function() {
        return this.x;
    }

    this.getColumn = function() {
        return this.y;
    }

    this.getPoints = function() {
        return this.getTile().points;
    }

    this.isBoardCenter = function() {
        return this.boardCenter == true;
    }

    this.getRaw = function() {
        return {
            tile: that.tile,
            x: that.x,
            y: that.y
        }
    }

}
