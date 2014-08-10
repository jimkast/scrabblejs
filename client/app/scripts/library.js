function Board(){
  this.rows = [];
  this.cols = [];
  this.board = [];

  function addTile(coords, tile){
    this.board.findPlaceholder(coords).addTile(tile);
  }

}



function Placeholder(_coords, _special, _letter, _tile){
  this.coords = _coords;
  this.special = _special;
  this.used = false;
  this.letter = _letter || null;
  this.tile = _tile || null;
}


function Tile(){
  this.letter = _letter;
  this.points = _points;
}


var holders = [
  {'class':'s0'},
  {'class':'s1'},
  {'class':'s2'},
  {'class':'s3'}
];

var board = [
  [
    {'type':4},
    {'type':0},
    {'type':0},
    {'type':1},
    {'type':0},
    {'type':0},
    {'type':0},
    {'type':3},
    {'type':0},
    {'type':0},
    {'type':0},
    {'type':1},
    {'type':0},
    {'type':0},
    {'type':4}
  ],
  [
    {'type':0},
    {'type':3},
    {'type':0},
    {'type':0},
    {'type':0},
    {'type':2},
    {'type':0},
    {'type':0},
    {'type':0},
    {'type':2},
    {'type':0},
    {'type':0},
    {'type':0},
    {'type':3},
    {'type':0}
  ],
  [
    {'type':0},
    {'type':0},
    {'type':0},
    {'type':0},
    {'type':0},
    {'type':0},
    {'type':0},
    {'type':0},
    {'type':0},
    {'type':0},
    {'type':0},
    {'type':0},
    {'type':0},
    {'type':0},
    {'type':0}
  ]
];