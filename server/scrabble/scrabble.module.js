// module.exports = {
//  Board: require('./_classes/board'),
//  Bucket: require('./_classes/bucket'),
//  Game: require('./_classes/game'),
//  Move: require('./_classes/move'),
//  Placeholder: require('./_classes/placeholder'),
//  Player: require('./_classes/player'),
//  Square: require('./_classes/square'),
//  Tile: require('./_classes/tile'),
//  Tileslist: require('./_classes/tilesList'),
//  Word: require('./_classes/word'),
//  constants: require('./_constants/constants')
// };



var randomInteger = function(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

var extend = function(destination, source) {
    for (var property in source) {
        if (destination[property] && (typeof(destination[property]) == 'object') && (destination[property].toString() == '[object Object]') && source[property])
            extend(destination[property], source[property]);
        else
            destination[property] = source[property];
    }
    return destination;
}









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



scrabble.langPacks = {

    el: {
        "meta": {
            "language": {
                "code": "el-gr",
                "prefix": "gr",
                "name": "Greek"
            }

        },

        "letterSetup": [{
            "code": "a",
            "letter": "Α",
            "class": "A",
            "points": 1,
            "total": 9
        }, {
            "code": "b",
            "letter": "Β",
            "class": "B",
            "points": 8,
            "total": 1
        }, {
            "code": "g",
            "letter": "Γ",
            "class": "G",
            "points": 4,
            "total": 1
        }, {
            "code": "d",
            "letter": "Δ",
            "class": "D",
            "points": 4,
            "total": 1
        }, {
            "code": "e",
            "letter": "Ε",
            "class": "E",
            "points": 1,
            "total": 1
        }, {
            "code": "z",
            "letter": "Ζ",
            "class": "Z",
            "points": 10,
            "total": 1
        }, {
            "code": "h",
            "letter": "Η",
            "class": "H",
            "points": 1,
            "total": 1
        }, {
            "code": "u",
            "letter": "Θ",
            "class": "U",
            "points": 10,
            "total": 1
        }, {
            "code": "i",
            "letter": "Ι",
            "class": "I",
            "points": 1,
            "total": 1
        }, {
            "code": "k",
            "letter": "Κ",
            "class": "K",
            "points": 2,
            "total": 1
        }, {
            "code": "l",
            "letter": "Λ",
            "class": "L",
            "points": 3,
            "total": 1
        }, {
            "code": "m",
            "letter": "Μ",
            "class": "M",
            "points": 3,
            "total": 1
        }, {
            "code": "n",
            "letter": "Ν",
            "class": "N",
            "points": 1,
            "total": 1
        }, {
            "code": "j",
            "letter": "Ξ",
            "class": "J",
            "points": 10,
            "total": 1
        }, {
            "code": "o",
            "letter": "Ο",
            "class": "O",
            "points": 1,
            "total": 1
        }, {
            "code": "p",
            "letter": "Π",
            "class": "P",
            "points": 2,
            "total": 1
        }, {
            "code": "r",
            "letter": "Ρ",
            "class": "R",
            "points": 2,
            "total": 1
        }, {
            "code": "s",
            "letter": "Σ",
            "class": "S",
            "points": 1,
            "total": 1
        }, {
            "code": "t",
            "letter": "Τ",
            "class": "T",
            "points": 1,
            "total": 1
        }, {
            "code": "y",
            "letter": "Υ",
            "class": "Y",
            "points": 2,
            "total": 1
        }, {
            "code": "f",
            "letter": "Φ",
            "class": "F",
            "points": 8,
            "total": 1
        }, {
            "code": "x",
            "letter": "Χ",
            "class": "X",
            "points": 8,
            "total": 1
        }, {
            "code": "c",
            "letter": "Ψ",
            "class": "C",
            "points": 10,
            "total": 1
        }, {
            "code": "w",
            "letter": "Ω",
            "class": "W",
            "points": 3,
            "total": 1
        }]

    },


    en: {

    }

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
        var tilesToPick = Math.min(num, that.getRemaining());
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
        if (that.getRemaining() > 0) {
            return that.tiles[index];
        } else {
            return -1;
        }
    }


}






scrabble.Tile = function() {



}









scrabble.Square = function(type) {

    var that = this;
    this.type = type;

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
            this.func = function() {};
    }


    that.getRaw = function() {
        return that;
    }

}









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









scrabble.Word = function(placeholders) {

    var that = this;

    that.placeholders = placeholders;
    that.points = 0;



    that.getLength = function() {
        return placeholders.length;
    }

    that.getPoints = function() {
        return that.points;
    }

    that.wordExists = function() {
        // Check if word is in database
        console.log(true, 'WORD EXISTS');
        return true;
    }


    var parseWord = function() {

        var index = 0;
        var pointsCounter = 0;
        var wordCallbackFunctions = [];
        var calcStr = '';
        var str = '';

        // Find first word start


        that.placeholders.forEach(function(curPlaceholder) {

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

            pointsCounter += tilePoints;

        });



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


    that.parse = function() {
        // Check if word exists
        var results = parseWord();
        that.results = results;
        that.points = results.points;
        return results;
    }


    that.getRaw = function() {
        var arr = [];
        that.placeholders.forEach(function(placeholder) {
            arr.push(placeholder.getRaw());
        })
        return arr;
    }


}









scrabble.Move = function(placeholders) {

    var that = this;

    that.placeholders = placeholders;
    that.points = 0;


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




    that.direction = getAlignedDirection();

}









scrabble.Bucket = function(bucketConfig) {

    // inherit tiles list
    var that = new scrabble.tilesList();


    that.meta = bucketConfig.meta;
    that.letterSetup = bucketConfig.letterSetup;
    // that.letterSetup = scrabble.langPacks.el;


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
                letterObject.id = (++counter);
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
                var placeholder = new scrabble.BoardPlaceholder(square, null, rowIndex, colIndex);

                if (rowIndex > 0) {
                    placeholder.top = topRow[colIndex];
                    topRow[colIndex].bottom = placeholder;
                }

                if (colIndex > 0) {
                    placeholder.left = leftPlaceholder;
                    leftPlaceholder.right = placeholder;
                }

                if (rowIndex === that.centerX && colIndex === that.centerY) {
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


    this.getCenter = function() {
        return board.data[that.centerX][that.centerY];
    }


    this.get = function(x, y) {
        return this.data[x][y];
    }

    this.place = function(placeholders) {
        placeholders.forEach(function(placeholder) {
            that.get(placeholder.x, placeholder.y).receiveTile(placeholder.tile).placeTile();
        });
        that.isEmpty = false;
    }


    // this.place2 = function(move) {
    //     move.placeholders.forEach(function(placeholder) {
    //         that.get(placeholder.x, placeholder.y).receiveTile(placeholder.getTile()).placeTile();
    //     });
    // }

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









scrabble.Game = function(id, name, size, languagePackCode, currentState, currentUser) {

    var that = this;

    var playTilesLength = 7;

    var GAME_WAITING_FOR_USERS = 1;
    var GAME_STARTED = 2;
    var GAME_FINISHED = 3;

    that.turn = 0;

    that.foldCounter = 0;

    var currentState = currentState || {};

    that.id = id;
    that.name = name;
    that.users = currentState.users || [];
    that.state = GAME_WAITING_FOR_USERS;
    that.history = currentState.state || currentState.history || [];
    that.size = parseInt(size);
    that.languagePack = scrabble.langPacks[languagePackCode];
    that.winnerUser = currentState.winner || {};
    that.bucketRemaining = currentState.bucketRemaining || 0;


    console.log(currentState.users, '345tewr4tertedrtgdrgt');

    if (currentState.users && currentState.users.length) {

        that.users.forEach(function(user, index) {
            console.log(currentState.users[index].tiles, 'tileslisrrrrrrrr')
            var tilesList = new scrabble.tilesList();
            tilesList.pushTiles(currentState.users[index].tiles);
            user.tiles = tilesList;
        });

    }



    that.getTilesFromBucket = function(num) {
        return that.bucket.pickTiles(num);
    }


    that.getUsernames = function() {
        var usernamesArray = [];
        that.users.forEach(function(user) {
            usernamesArray.push(user.username);
        });
        return usernamesArray;
    }

    that.userIsPlaying = function(username) {
        return that.users.some(function(user) {
            return user.username === username;
        })
    }

    if (currentUser) {
        that.registered = that.userIsPlaying(currentUser);
    }



    that.setBucketRemaining = function(remaining) {
        that.bucketRemaining = remaining;
    }




    // var shuffle = function(array) {
    //     var currentIndex = array.length,
    //         temporaryValue, randomIndex;

    //     // While there remain elements to shuffle...
    //     while (0 !== currentIndex) {

    //         // Pick a remaining element...
    //         randomIndex = Math.floor(Math.random() * currentIndex);
    //         currentIndex -= 1;

    //         // And swap it with the current element.
    //         temporaryValue = array[currentIndex];
    //         array[currentIndex] = array[randomIndex];
    //         array[randomIndex] = temporaryValue;
    //     }

    //     return array;
    // }






    that.getSize = function() {
        return that.size;
    }

    that.setSize = function(size) {
        that.size = parseInt(size);
    }



    that.isEmpty = function() {
        return that.users.length === 0;
    }

    that.totalRegistered = function() {
        return that.users.length;
    }



    that.getUser = function(username) {
        var i = 0;
        var userExists = that.users.some(function(user, index) {
            found = user.username === username;
            if (found) {
                i = index;
            }
            return found;
        })

        if (userExists) {
            return that.users[i];
        } else {
            return false;
        }
    }

    that.getUsers = function() {
        return that.users;
    }


    that.getPlayingUser = function() {
        var i = 0;
        var userExists = that.users.some(function(user, index) {
            found = user.isPlaying === true;
            if (found) {
                i = index;
            }
            return found;
        })

        if (userExists) {
            return that.users[i];
        } else {
            return false;
        }
    }






    that.registerUser = function(username) {
        var user = that.getUser(username);
        if (!user) {
            var index = that.users.push({
                username: username,
                tiles: new scrabble.tilesList()
            });
            // that.usernamesArray.push(username);
            return that.users[index - 1];
        }
        return false;
    }

    that.unregisterUser = function(username) {
        var pos = that.users.indexOf(username);
        if (pos > -1) {
            that.users.splice(that.users.indexOf(username), 1);
        } else {
            return false;
        }
    }





    that.board = new scrabble.Board();



    that.start = function() {
        that.state = GAME_STARTED;


        // that.board = new scrabble.Board();
        if (that.languagePack) {
            that.bucket = new scrabble.Bucket(that.languagePack);
        }

        // -------- that.send('game:start', 'Game has started.');

        that.playUsers = that.users.slice(0);


        // that.users.forEach(function(user) {
        //     that.sendTiles(playTilesLength, user.username);
        // });

        // that.giveTurn();
    }

    that.finish = function(winner) {
        that.state = GAME_FINISHED;

        if (winner) {
            that.winnerUser = winner;
            console.log(that.id + ' : game has ended, winner: ', winner);
        } else {
            console.log('No winner for this game ');
        }

    }



    // that.giveTurn = function(turn) {
    //     that.playUsers[that.turn].isPlaying = false;
    //     that.playUsers[turn].isPlaying = true;

    //     that.turn = turn;
    // }


    that.giveTurn = function(username) {
        that.getPlayingUser().isPlaying = false;
        that.getUser(username).isPlaying = true;
    }


    that.sendTiles = function(username, newTiles) {
        console.log(that.users, 'SEND TILESSSSSSSSS', username)
        that.getUser(username).tiles.pushTiles(newTiles);
        return newTiles;
    }


    that.stopUser = function(username) {
        var pos = that.playUsers.indexOf(that.getUser(username));
        if (pos > -1) {
            that.playUsers.splice(pos, 1);
        } else {
            return false;
        }
    }


    that.quit = function(username, tiles) {

        that.bucket.pushTiles(tiles);

        that.stopUser(username);

        if (that.playUsers.length === 1) {
            var winner = that.playUsers[0];
            that.finish(winner);
        } else if (that.playUsers.length === 0) {
            that.finish();
        }

    }


    that.fold = function(username, tiles) {


        // that.removeTiles(username, tiles);


        // if ((that.foldCounter++) >= 2 * that.totalRegistered()) {
        //     that.finish();
        //     return;
        // }



        // var size = tiles.length;
        // var bucketRemaining = that.bucket.getRemaining();
        // var userTilesRemaining = that.getUser(username).tiles.getRemaining();
        // if (bucketRemaining <= userTilesRemaining) {
        //     that.bucket.pushTiles(tiles.pickTiles(userTilesRemaining - bucketRemaining));
        // }

        // that.sendTiles(size, username);
        // that.bucket.pushTiles(tiles);

        // return that.foldCounter;
    }


    that.placeSuccessfulMove = function(username, _move) {
        console.log(_move)
        var placeholders = [];

        _move.placeholders.forEach(function(placeholder) {
            placeholders.push(that.board.get(placeholder.x, placeholder.y).receiveTile(placeholder.tile));
            // placeholders.push(new scrabble.Placeholder(placeholder.square, placeholder.x, placeholder.y, placeholder.tile));
        });

        var move = new scrabble.Move(placeholders);


        var results = move.parse();

        that.board.place(placeholders);

        that.foldCounter = 0;



        // var user = that.getUser(username);
        // if (user.tiles.getRemaining() === 0 && that.bucket.getRemaining() === 0) {
        //     var winner = user;
        //     that.finish(winner);
        // } else {
        //     that.giveTurn();
        // }

    }



    that.removeTiles = function(username, tiles) {
        if (!(tiles instanceof Array)) return;

        var userTiles = that.getUser(username).tiles;

        tiles.forEach(function(tile, index) {
            userTiles.pickTile(tile);
        });

    }


    that.getRaw = function() {
        return {
            id: that.id,
            name: that.name,
            users: that.users,
            turn: that.turn,
            size: that.size,
            state: that.state,
            history: that.history,
            languagePack: languagePackCode,
            winner: that.winnerUser
        }
    }
}









scrabble.GamesManager = function() {

    var GAME_WAITING_FOR_USERS = 1;
    var GAME_STARTED = 2;
    var GAME_FINISHED = 3;

    var that = this;

    that.games = {};


    that.gamesArray = [];


    var emptyArray = function(A) {
        if (A instanceof Array) {
            while (A.length > 0) {
                A.pop();
            }
        }
    }

    var objectToArray = function(obj, arr) {
        if (arr instanceof Array) {
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    arr.push(obj[key]);
                }
            }
        }
    }


    that.findGameById = function(gameID) {
        var pos = -1;
        that.gamesArray.some(function(game, index) {
            var found = game.id === gameID;
            if (found) {
                pos = index;
            }
            return found;
        });

        return that.gamesArray[pos];
    }









    var guid = function() {
        return Math.floor(Math.random() * 100000).toString();
    }

    var generateGameId = function() {
        var id = guid();
        while (that.games.id) {
            id = guid();
        }
        return id;
    }



    that.setGames = function(games) {


        for (var key in games) {
            if (games.hasOwnProperty(key)) {
                that.createGame(games[key]);
            }
        }

        // extend(that.games, games);

        // objectToArray(that.games, that.gamesArray);
    }

    that.getGames = function(gameId) {
        return that.games;
    }

    that.getGame = function(gameId) {
        return that.games[gameId];
    }


    // that.createGame = function(name, totalPlayers, languagePack) {
    //     var id = generateGameId();
    //     that.games[id] = new Game(id, name, totalPlayers, languagePack, that.wss);
    //     return that.games[id];
    // }


    that.createGame = function(game) {
        var newGame = new scrabble.Game(game.id, game.name, game.size, game.languagePack, game);
        that.games[game.id] = newGame;
        console.log(that.games, game, 'gameeeeeee');


        that.gamesArray.push(newGame);

        return newGame;
    }

    that.deleteGame = function(gameId) {

        that.gamesArray.splice(that.gamesArray.indexOf(that.findGameById(gameId)), 1);

        delete that.games[gameId];
    }



    that.registerUserForGame = function(username, gameId) {
        console.log(that.games, username, gameId, 'registerUserForGame')
        return that.getGame(gameId).registerUser(username);
    }

    that.unregisterUserFromGame = function(username, gameId) {
        return that.getGame(gameId).unregister(username);
    }



    that.getRaw = function() {
        var arr = [];
        for (var property in that.games) {
            if (that.games.hasOwnProperty(property)) {
                arr.push(that.games[property].getRaw());
            }
        }
        return arr;
    }



}









scrabble.Player = function(id, rack) {


    this.person = {};
    // name
    // id
    this.rack = rack || new scrabble.tilesList();


}









module.exports = scrabble;
