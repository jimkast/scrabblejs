global.scrabble = {};

module.exports = {

    utilities: require('./utilities/utilities.js'),

    constants: require('./constants/constants').constants,
    langPacks: require('./language-packs/el.js'),

    Player: require('./classes/Player').Player,

    Tile: require('./classes/Tile').Tile,
    tileslist: require('./classes/TilesList').tileslist,

    Square: require('./classes/Square').Square,
    Placeholder: require('./classes/Placeholder').Placeholder,
    BoardPlaceholder: require('./classes/BoardPlaceholder').BoardPlaceholder,

    Move: require('./classes/Move').Move,
    Word: require('./classes/Word').Word,


    Bucket: require('./classes/Bucket').Bucket,
    Board: require('./classes/Board').Board,


    Game: require('./classes/Game').Game,
    GamesManager: require('./classes/GamesManager').GamesManager

};



// module.exports = {
// 	aaa: function(){
// 		console.log('sdfgdgdf');
// 	}
// }