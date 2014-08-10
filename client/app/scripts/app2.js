/*  --- CONFIGURATION --- */

var SCOPE_LETTER = 1;
var SCOPE_WORD = 2;

var HORIZONTAL = 1;
var VERTICAL = 2;




function Bucket(languageOptions, letterSetup) {

    this.lang = languageOptions;
    this.letterSetup = letterSetup;
    this.letters = [];

    var that = this;

    this.generateBucket = function() {
        var config = this.letterSetup;
        if (!(config instanceof Array)) return;

        var arr = [];

        config.forEach(function(letterConfig) {

            var letterObject = extend({}, letterConfig);
            delete letterObject.total;

            for (var i = 0; i < letterConfig.total; i++) {
                arr.push(letterObject);
            }
        });

        this.letters = arr;
    }

    var pickLetter = function() {
        return that.letters.splice(randomInteger(0, that.letters.length), 1)[0];
    }

    var putLetter = function(letter) {
        that.letters.push(letter);
    }

    this.pickLetters = function(size) {
        var arr = [];
        var lettersToPick = Math.min(size, this.letters.length);
        for (var i = 0; i < lettersToPick; i++) {
            arr.push(pickLetter());
        }
        return arr;
    }

    this.putLetters = function(letters) {
        for (var i = 0; i < letters.length; i++) {
            this.putLetter(letters[i]);
        }
    }

}


var greekLetterSetup = [
    {code: 'a', letter: 'Α', class: 'A', points: 1, total: 9},
    {code: 'b', letter: 'Β', class: 'B', points: 8, total: 3},
    {code: 'g', letter: 'Γ', class: 'G', points: 4, total: 3},
    {code: 'd', letter: 'Δ', class: 'D', points: 4, total: 3},
    {code: 'e', letter: 'Ε', class: 'E', points: 1, total: 3},
    {code: 'z', letter: 'Ζ', class: 'Z', points: 1, total: 3},
    {code: 'h', letter: 'Η', class: 'H', points: 1, total: 3},
    {code: 'u', letter: 'Θ', class: 'U', points: 1, total: 3},
    {code: 'i', letter: 'Ι', class: 'I', points: 1, total: 3},
    {code: 'k', letter: 'Κ', class: 'K', points: 2, total: 3},
    {code: 'l', letter: 'Λ', class: 'L', points: 3, total: 3},
    {code: 'm', letter: 'Μ', class: 'M', points: 3, total: 3},
    {code: 'n', letter: 'Ν', class: 'N', points: 1, total: 3},
    {code: 'j', letter: 'Ξ', class: 'J', points: 1, total: 3},
    {code: 'o', letter: 'Ο', class: 'O', points: 1, total: 3},
    {code: 'p', letter: 'Π', class: 'P', points: 2, total: 3},
    {code: 'r', letter: 'Ρ', class: 'R', points: 1, total: 3},
    {code: 's', letter: 'Σ', class: 'S', points: 1, total: 3},
    {code: 't', letter: 'Τ', class: 'T', points: 1, total: 3},
    {code: 'y', letter: 'Υ', class: 'Y', points: 2, total: 3},
    {code: 'f', letter: 'Φ', class: 'F', points: 8, total: 3},
    {code: 'x', letter: 'Χ', class: 'X', points: 8, total: 3},
    {code: 'c', letter: 'Ψ', class: 'C', points: 1, total: 3},
    {code: 'w', letter: 'Ω', class: 'W', points: 3, total: 3}
];


var greekLangpack = new Bucket({
    code: 'el-gr',
    prefix: 'gr',
    name: 'Greek'
}, greekLetterSetup);


function init() {
    greekLangpack.generateBucket();
}


init();


var squareTypes = [{
    class: 's0'
}, {
    class: 's1',
    scope: SCOPE_LETTER,
    func: function(letter_points) {
        return {
            points: letter_points * 2,
            string: letter_points + 'x2'
        }
    }
}, {
    class: 's2',
    scope: SCOPE_LETTER,
    func: function(letter_points) {
        return {
            points: letter_points * 3,
            string: letter_points + 'x3'
        }
    }
}, {
    class: 's3',
    scope: SCOPE_WORD,
    func: function(word_points) {
        return {
            points: word_points * 2,
            string: 'x2'
        }
    }
}, {
    class: 's4',
    scope: SCOPE_WORD,
    func: function(word_points) {
        return {
            points: word_points * 3,
            string: 'x3'
        }
    }
}];



/* UTILITIES */
function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function extend(destination, source) {
    for (var property in source) {
        if (destination[property] && (typeof(destination[property]) == 'object') && (destination[property].toString() == '[object Object]') && source[property])
            extend(destination[property], source[property]);
        else
            destination[property] = source[property];
    }
    return destination;
}





/* LOGIC - STRUCTURE */



function letter(letterOptions) {
    // if(typeof letter === 'Object'){
    // 	this.letter = letterOptions.letter;
    // 	this.class = letterOptions.class;
    // 	this.points = letterOptions.points;
    // }
}



function letterBucket(config) {


}






function Placeholder() {

}

Placeholder.prototype.next = function() {

}

Placeholder.prototype.prev = function() {

}

Placeholder.prototype.isFilled = function() {

}
