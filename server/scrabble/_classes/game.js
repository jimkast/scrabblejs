var Game = function(playersNumber, boardType, languagePack) {

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

module.exports = Game;