(function(scrabble) {

    scrabble.Player = function(id, rack) {


        this.person = {};
        // name
        // id
        this.rack = rack || new scrabble.tilesList();




    }

})(typeof exports === 'undefined' ? window.scrabble : exports);
