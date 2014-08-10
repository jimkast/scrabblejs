var Board = function(buildConfig) {

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


    this.place2 = function(move) {
        move.placeholders.forEach(function(placeholder) {
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


module.exports = Board;
