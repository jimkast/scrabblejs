var Square = function(type) {
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


module.exports = Square;
