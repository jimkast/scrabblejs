(function(scrabble) {

    scrabble.BoardPlaceholder = function(square, tile, x, y) {

        var that = new scrabble.Placeholder(square, tile);
        that.x = x;
        that.y = y;


        that.getRow = function() {
            return that.x;
        }

        that.getColumn = function() {
            return that.y;
        }



        that.prev = function(direction) {
            if (direction === scrabble.constants.DIR_VERTICAL) return that.top;
            else return that.left;
        }

        that.next = function(direction) {
            if (direction === scrabble.constants.DIR_VERTICAL) return that.bottom;
            else return that.right;
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

        that.getAllNeightbours = function() {
            return getNeighbours(function() {
                return true;
            });
        }

        that.getPlacedNeighbours = function() {
            return getNeighbours(function(placeholder) {
                return placeholder.isPlaced();
            });
        }

        that.getEmptyNeighbours = function() {
            return getNeighbours(function(placeholder) {
                return placeholder.isEmpty();
            });
        }

        that.hasPlacedNeighbours = function() {
            return that.getPlacedNeighbours().length > 0;
        }

        that.hasEmptyNeighBours = function() {
            return that.getEmptyNeighbours().length === 4;
        }


        that.getRaw = function() {
            return {
                square: square.getRaw(),
                tile: that.tile,
                x: that.x,
                y: that.y
            }
        }


        that.isBoardCenter = function() {
            return that.boardCenter == true;
        }

        return that;
    }


})(typeof global === 'undefined' ? window.scrabble : global.scrabble);
