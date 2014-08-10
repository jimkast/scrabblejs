var scrabble = {};

scrabble.constants = {
    
    SCOPE_LETTER: 1,
    SCOPE_WORD: 2,

    DIR_HORIZONTAL: 1,
    DIR_VERTICAL: 2,

    SQUARE_SIMPLE: 1,
    SQUARE_LETTER_DOUBLE: 1,
    SQUARE_LETTER_TRIPLE: 2,
    SQUARE_WORD_DOUBLE: 3,
    SQUARE_WORD_TRIPLE: 4
}


scrabble.Move = function(placeholders) {

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



    this.getRaw = function() {
        var arr = [];
        that.placeholders.forEach(function(placeholder) {
            arr.push(placeholder.getRaw());
        })
        return arr;
    }

    init();

}



scrabble.Board = function(buildConfig) {

    var that = this;
    this.data = [];
    this.isEmpty = true;


    var buildObj = buildConfig || {
        data: [
            [{
                type: 4
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 1
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 3
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 1
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 4
            }],
            [{
                type: 0
            }, {
                type: 3
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 2
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 2
            }, {
                type: 0,
                tile: {
                    letter: "P",
                    id: 1,
                    class: "P",
                    points: 2
                },
                placed: true
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 3
            }, {
                type: 0
            }],
            [{
                type: 0
            }, {
                type: 0
            }, {
                type: 3
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 1
            }, {
                type: 0
            }, {
                type: 1
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 3
            }, {
                type: 0
            }, {
                type: 0
            }, ],
            [{
                type: 1
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 3
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 1
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 3
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 1
            }, ],
            [{
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 3
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 3
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }],
            [{
                type: 0
            }, {
                type: 2
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 2
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 2
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 2
            }, {
                type: 0
            }],
            [{
                type: 0
            }, {
                type: 0
            }, {
                type: 1
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 1
            }, {
                type: 0
            }, {
                type: 1
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 1
            }, {
                type: 0
            }, {
                type: 0
            }, ],
            [{
                type: 4
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 1
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 3
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 1
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 4
            }, ],
            [{
                type: 0
            }, {
                type: 0
            }, {
                type: 1
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 1
            }, {
                type: 0
            }, {
                type: 1
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 1
            }, {
                type: 0
            }, {
                type: 0
            }, ],

            [{
                type: 0
            }, {
                type: 2
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 2
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 2
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 2
            }, {
                type: 0
            }],
            [{
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 3
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 3
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }],
            [{
                type: 1
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 3
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 1
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 3
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 1
            }, ],
            [{
                type: 0
            }, {
                type: 0
            }, {
                type: 3
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 1
            }, {
                type: 0
            }, {
                type: 1
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 3
            }, {
                type: 0
            }, {
                type: 0
            }, ],
            [{
                type: 0
            }, {
                type: 3
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 2
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 2
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 3
            }, {
                type: 0
            }],
            [{
                type: 4
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 1
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 3
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 1
            }, {
                type: 0
            }, {
                type: 0
            }, {
                type: 4
            }]
        ]
    };


    var squareTypes = [
        new scrabble.Square(),
        new scrabble.Square(scrabble.constants.SQUARE_LETTER_DOUBLE),
        new scrabble.Square(scrabble.constants.SQUARE_LETTER_TRIPLE),
        new scrabble.Square(scrabble.constants.SQUARE_WORD_DOUBLE),
        new scrabble.Square(scrabble.constants.SQUARE_WORD_TRIPLE)
    ];

    function mapSquareType(squareType) {
        switch (squareType) {
            case scrabble.constants.SQUARE_LETTER_DOUBLE:
                return 1;
            case scrabble.constants.SQUARE_LETTER_TRIPLE:
                return 2;
            case scrabble.constants.SQUARE_WORD_DOUBLE:
                return 3;
            case scrabble.constants.SQUARE_WORD_TRIPLE:
                return 4;
            default:
                return 0;
        }
    }


    var build = function() {

        var arr = [];
        var topRow = null;

        that.centerX = Math.floor(buildObj.data.length / 2);
        that.centerY = Math.floor(buildObj.data[0].length / 2);

        buildObj.data.forEach(function(row, rowIndex) {
            var newRow = [];
            var leftPlaceholder = null;
            row.forEach(function(column, colIndex) {
                var square = squareTypes[mapSquareType(column.type)];
                var placeholder = new scrabble.Placeholder(square, rowIndex, colIndex);

                if (rowIndex > 0) {
                    placeholder.top = topRow[colIndex];
                    topRow[colIndex].bottom = placeholder;
                }

                if (colIndex > 0) {
                    placeholder.left = leftPlaceholder;
                    leftPlaceholder.right = placeholder;
                }

                if(rowIndex === that.centerX && colIndex === that.centerY){
                    placeholder.boardCenter = true;
                }

                newRow.push(placeholder);
                leftPlaceholder = placeholder;
            });
            topRow = newRow;
            arr.push(newRow);
        });
        that.data = arr;
    }


    this.getCenter = function(){
        return board.data[that.centerX][that.centerY];
    }


    this.get = function(x, y) {
        return this.data[x][y];
    }

    this.place = function(placeholders){
        placeholders.forEach(function(placeholder){
            that.get(placeholder.x, placeholder.y).receiveTile(placeholder.tile).placeTile();
        });
    }


        this.place2 = function(move){
        move.placeholders.forEach(function(placeholder){
            that.get(placeholder.x, placeholder.y).receiveTile(placeholder.getTile()).placeTile();
        });
    }

    this.getPlayLetters = function() {
        var moveLetters = [];
        this.data.forEach(function(row, rowIndex) {
            row.forEach(function(placeholder, colIndex) {
                if (placeholder.isPlayHolder()) {
                    moveLetters.push(placeholder);
                }
            })
        })
        return moveLetters;
    }


    build();
}



scrabble.Bucket = function(bucketConfig) {

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



scrabble.Placeholder = function(square, x, y) {

    this.square = square;
    this.x = x;
    this.y = y;

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
            tile: that.getTile(),
            x: that.x,
            y: that.y
        }
    }

}



scrabble.Game = function(playersNumber, boardType, languagePack) {

    var that = this;

    this.players = [];
    this.history = [];
    this.board;
    this.bucket;

    var init = function() {
        that.players.push({

        });

        that.board = new scrabble.Board(boardType);
        that.bucket = new scrabble.Bucket(languagePack);

    }


    this.getTiles = function() {
        
    }

    this.historyAdd = function(move, player) {
        var historyObject = {
            move: move,
            player: player,
            datetime: new Date()
        };

        this.history.push(historyObject);
    }

    this.end = function() {
        that.completed = true;
        // other store actions after end of game here...
    }

    init();

}




scrabble.tilesList = function(numberOfTiles) {

    var that = this;

    this.size = numberOfTiles || 7;
    this.tiles = [];


    this.getTotal = function() {
        return that.size;
    }

    this.getRemaining = function() {
        return that.tiles.length;
    }

    this.isEmpty = function() {
        return that.getRemaining() <= 0;
    }

    this.pickTile = function(tilePosition) {
        var currentLast = that.getRemaining() - 1;
        if (tilePosition !== parseInt(tilePosition)) {
            tilePosition = that.indexOf(tilePosition);
        }
        var pos = tilePosition >= 0 && tilePosition <= currentLast ? tilePosition : currentLast;
        return that.tiles.splice(pos, 1)[0];
    }

    this.popTile = function() {
        return that.tiles.pop();
    }

    this.pushTile = function(tile) {
        return that.tiles.push(tile);
    }

    this.pickTiles = function(num) {
        var arr = [];
        var tilesToPick = Math.min(num, that.getTotal());
        for (var i = 0; i < tilesToPick; i++) {
            arr.push(that.pickTile());
        }
        return arr;
    }

    this.pushTiles = function(tiles) {
        var newLength = 0;
        tiles.forEach(function(tile) {
            that.pushTile(tile);
        });
        return that.getRemaining();
    }

    this.indexOf = function(tile) {
        return that.tiles.indexOf(tile);
    }

    this.get = function(index) {
        if(that.getRemaining() > 0){
            return that.tiles[index];
        }
        else {
            return -1;
        }
    }


}



scrabble.Player = function(id, rack){


    this.person = {};
    // name
    // id
    this.rack = rack || new scrabble.tilesList();


}



scrabble.Tile = function(){



}



scrabble.Square = function(type) {
    switch (type) {
        case scrabble.constants.SQUARE_LETTER_DOUBLE:
            this.class = 's1';
            this.scope = scrabble.constants.SCOPE_LETTER;
            this.func = function(letterPoints) {
                return {
                    points: letterPoints * 2,
                    string: 'x2'
                }
            }
            break;

        case scrabble.constants.SQUARE_LETTER_TRIPLE:
            this.class = 's2';
            this.scope = scrabble.constants.SCOPE_LETTER;
            this.func = function(letterPoints) {
                return {
                    points: letterPoints * 3,
                    string: 'x3'
                }
            }
            break;

        case scrabble.constants.SQUARE_WORD_DOUBLE:
            this.class = 's3';
            this.scope = scrabble.constants.SCOPE_WORD;
            this.func = function(wordPoints) {
                return {
                    points: wordPoints * 2,
                    string: 'x2'
                }
            }
            break;

        case scrabble.constants.SQUARE_WORD_TRIPLE:
            this.class = 's4';
            this.scope = scrabble.constants.SCOPE_WORD;
            this.func = function(wordPoints) {
                return {
                    points: wordPoints * 3,
                    string: 'x3'
                }
            }
            break;
        default:
             this.class = '';
             this.func = function(){};
    }
}


scrabble.Move = function(){

}


module.exports = scrabble;