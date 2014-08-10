(function(scrabble) {

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


})(typeof exports === 'undefined' ? window.scrabble : exports);
