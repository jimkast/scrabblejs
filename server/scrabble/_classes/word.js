var Word = function(){

	var that = this;
    this.placeholders = [];
    this.direction = null;
    this.points = 0;


    this.parse = function(anyWordPlaceHolder, direction) {

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

}

module.exports = Word;