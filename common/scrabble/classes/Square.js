(function(scrabble) {

    scrabble.Square = function(type) {

        var that = this;

        that.type = type;

        switch (type) {
            case scrabble.constants.SQUARE_LETTER_DOUBLE:
                that.class = 's1';
                that.scope = scrabble.constants.SCOPE_LETTER;
                that.func = function(letterPoints) {
                    return {
                        points: letterPoints * 2,
                        string: 'x2'
                    }
                }
                break;

            case scrabble.constants.SQUARE_LETTER_TRIPLE:
                that.class = 's2';
                that.scope = scrabble.constants.SCOPE_LETTER;
                that.func = function(letterPoints) {
                    return {
                        points: letterPoints * 3,
                        string: 'x3'
                    }
                }
                break;

            case scrabble.constants.SQUARE_WORD_DOUBLE:
                that.class = 's3';
                that.scope = scrabble.constants.SCOPE_WORD;
                that.func = function(wordPoints) {
                    return {
                        points: wordPoints * 2,
                        string: 'x2'
                    }
                }
                break;

            case scrabble.constants.SQUARE_WORD_TRIPLE:
                that.class = 's4';
                that.scope = scrabble.constants.SCOPE_WORD;
                that.func = function(wordPoints) {
                    return {
                        points: wordPoints * 3,
                        string: 'x3'
                    }
                }
                break;
            default:
                that.class = '';
                that.func = function() {};
        }


        that.getRaw = function() {
            return that;
        }
    }


})(typeof exports === 'undefined' ? window.scrabble : exports);
