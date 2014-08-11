(function(scrabble) {

    scrabble.Player = function(id, rack) {


        this.person = {};
        // name
        // id
        this.rack = rack || new scrabble.tilesList();




    }

})(typeof global === 'undefined' ? window.scrabble : global.scrabble);