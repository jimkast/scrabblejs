var Move = function(placeholders) {

    var that = this;
    this.placeholders = [];
    this.direction = null;
    this.points = 0;
    this.results;

    var init = function() {
        that.placeholders = placeholders;
        that.direction = getAlignedDirection();
    }

    this.getPoints = function() {
        return this.points;
    }

    var getAlignedDirection = function() {

        var arr = that.placeholders;

        var dir = scrabble.constants.DIR_HORIZONTAL;
        if (arr.length > 1 && arr[0].y === arr[1].y) {
            dir = scrabble.constants.DIR_VERTICAL;
        }
        return dir;
    }

    var isAligned = function() {

        var arr = that.placeholders;

        if (!(arr instanceof Array) || arr.length === 0) return false;

        var curRow = arr[0].getRow();
        var curCol = arr[0].getColumn();
        var isAligned = true;

        arr.forEach(function(placeholder) {
            isAligned = isAligned && (placeholder.getRow() == curRow || placeholder.getColumn() == curCol);
        });


        console.log(isAligned, 'isAligned');
        return isAligned;
    }


    var isConnected = function() {

        // if (!(arr.length && arr[0].x && arr[0].y)) return false;
        var isCon = that.placeholders.some(function(placeholder) {
            return placeholder.hasPlacedNeighbours();
        });
        console.log(isCon, 'isConnected: ');

        return isCon;

    }


    var firstMoveCheck = function() {
        if (that.placeholders.length < 2) {
            console.log(false, 'mustContain more than 2 letters');
            return false;
        }
        var passesFromCenter = that.placeholders.some(function(placeholder) {
            return placeholder.isBoardCenter();
        });

        console.log(passesFromCenter, 'passes from board center');
        return passesFromCenter;
    }

    var hasGaps = function() {
        var curPlaceholder
        for (var curPlaceholder = that.placeholders[0]; curPlaceholder != that.placeholders[that.placeholders.length - 1]; curPlaceholder = curPlaceholder.next(that.direction)) {
            if (!curPlaceholder.isFilled()) {
                console.log(false, 'has Gaps');
                return true;
            }
        }
        console.log(true, 'does not have GAPS');
        return false;
    }


    var wordExists = function() {
        // Check if word is in database
        console.log(true, 'WORD EXISTS');
        return true;
    }


    this.isValid = function(emptyBoard) {
        var connectFunction = emptyBoard ? firstMoveCheck : isConnected;
        var result = isAligned() && !hasGaps() && connectFunction() && wordExists();
        // console.log('result:', result, 'isAligned:', isAligned(), 'isConnected:', isConnected());
        return result;
    }


    // this.place = function() {
    //     that.placeholders.forEach(function(placeholder) {
    //         placeholder.place();
    //     });
    // }


    var findWordStartFromPlaceholder = function(placeholder, direction) {
        var curPlaceholder = placeholder;
        var prevPlaceholder = placeholder.prev(direction);

        while (prevPlaceholder && prevPlaceholder.isFilled()) {
            curPlaceholder = prevPlaceholder;
            prevPlaceholder = curPlaceholder.prev(direction);
        }

        return curPlaceholder;
    }


    var findWordStart = function() {
        return findWordStartFromPlaceholder(that.placeholders[0], that.direction);
    }


    var parseWord = function(anyWordPlaceHolder, direction) {

        var index = 0;
        var pointsCounter = 0;
        var wordCallbackFunctions = [];
        var calcStr = '';
        var str = '';

        // Find first word start
        curPlaceholder = findWordStartFromPlaceholder(anyWordPlaceHolder, direction);

        while (curPlaceholder && curPlaceholder.isFilled()) {

            var tilePoints = 0;
            var squareType = curPlaceholder.getType();
            var tile = curPlaceholder.getTile();

            str += curPlaceholder.getLetter();
            if (index++ > 0) {
                calcStr += ' + ';
            }
            calcStr += curPlaceholder.getPoints();

            if (curPlaceholder.isPlaced()) {
                tilePoints = curPlaceholder.getPoints();
            } else {
                if (squareType.scope == scrabble.constants.SCOPE_LETTER && typeof squareType.func === 'function') {
                    var funcResult = squareType.func(curPlaceholder.getPoints());
                    tilePoints = funcResult.points;
                    calcStr += funcResult.string;
                } else if (squareType.scope == scrabble.constants.SCOPE_WORD && typeof squareType.func === 'function') {
                    tilePoints = curPlaceholder.getPoints();
                    wordCallbackFunctions.push(squareType.func);
                } else {
                    tilePoints = curPlaceholder.getPoints();
                }
            }

            curPlaceholder = curPlaceholder.next(direction);

            pointsCounter += tilePoints;

        } // endwhile


        if (wordCallbackFunctions.length > 0) {
            calcStr = '(' + calcStr + ')';
            wordCallbackFunctions.forEach(function(func) {
                var funcResult = func(pointsCounter);
                pointsCounter = funcResult.points;
                calcStr += ' ' + funcResult.string + ' ';
            });
        }

        return {
            'string': str,
            'points': pointsCounter,
            'calcString': calcStr
        }

    }

    var parseMoveResults = function(moveResults) {
        var sum = 0;
        moveResults.forEach(function(wordResults) {
            sum += wordResults.points;
        });
        that.points = sum;
    }

    this.parse = function() {
        var results = [];
        var oppDir = oppositeDirection(that.direction);

        // Parse Main Word
        results.push(parseWord(that.placeholders[0], that.direction));

        // Parse Side Words
        that.placeholders.forEach(function(placeholder) {
            if (placeholder.hasPlacedNeighbours()) {
                results.push(parseWord(placeholder, oppDir));
            }
        });

        this.results = results;
        parseMoveResults(results);
        console.log(results, 'TOTAL MOVE RESULTS');
        return results;
    }


    var oppositeDirection = function(direction) {
        if (direction === scrabble.constants.DIR_HORIZONTAL) return scrabble.constants.DIR_VERTICAL;
        return scrabble.constants.DIR_HORIZONTAL;
    }







    init();

}


module.exports = Move;
