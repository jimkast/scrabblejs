(function(scrabble) {

    scrabble.Move = function(placeholders) {

        var that = this;


        var init = function() {
            that.direction = null;
            that.points = 0;
            that.placeholders = placeholders;
            that.direction = getAlignedDirection();
        }


        that.getPoints = function() {
            return that.points;
        }


        var getAlignedDirection = function() {

            var arr = that.placeholders;

            var dir = scrabble.constants.DIR_HORIZONTAL;
            if (arr.length > 1 && arr[0].y === arr[1].y) {
                dir = scrabble.constants.DIR_VERTICAL;
            }
            return dir;
        }

        var oppositeDirection = function(direction) {
            if (direction === scrabble.constants.DIR_HORIZONTAL) return scrabble.constants.DIR_VERTICAL;
            return scrabble.constants.DIR_HORIZONTAL;
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

        var hasGaps = function() {
            for (var curPlaceholder = that.placeholders[0]; curPlaceholder != that.placeholders[that.placeholders.length - 1]; curPlaceholder = curPlaceholder.next(that.direction)) {
                if (!curPlaceholder.isFilled()) {
                    console.log(false, 'has Gaps');
                    return true;
                }
            }
            console.log(true, 'does not have GAPS');
            return false;
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


        that.isValid = function(emptyBoard) {
            var connectFunction = emptyBoard ? firstMoveCheck : isConnected;
            var result = isAligned() && !hasGaps() && connectFunction(); //&& wordExists();
            // console.log('result:', result, 'isAligned:', isAligned(), 'isConnected:', isConnected());
            return result;
        }


        // that.place = function() {
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




        var parseMoveResults = function(moveResults) {
            var sum = 0;
            moveResults.forEach(function(wordResults) {
                sum += wordResults.points;
            });
            that.points = sum;
        }


        var getWord = function(anyWordPlaceHolder, direction) {

            var placeholders = [];
            var curPlaceholder = findWordStartFromPlaceholder(anyWordPlaceHolder, direction);

            while (curPlaceholder && curPlaceholder.isFilled()) {

                placeholders.push(curPlaceholder);
                curPlaceholder = curPlaceholder.next(direction);
            }

            return new scrabble.Word(placeholders);
        }


        var getWords = function() {

            var words = [];
            var oppDir = oppositeDirection(that.direction);


            words.push(getWord(that.placeholders[0], that.direction));

            that.placeholders.forEach(function(placeholder) {
                if (placeholder.hasPlacedNeighbours()) {
                    words.push(getWord(placeholder, oppDir));
                }
            });

            return words;
        }

        that.parse = function() {
            var results = [];
            var words = getWords();

            words.forEach(function(word) {
                results.push(word.parse());
            });

            that.results = results;
            parseMoveResults(results);
            console.log(results, 'TOTAL MOVE RESULTS');
            return results;
        }






        that.getRaw = function() {
            var arr = [];
            that.placeholders.forEach(function(placeholder) {
                arr.push(placeholder.getRaw());
            })
            return arr;
        }


        init();

    }

})(typeof exports === 'undefined' ? window.scrabble : exports);
