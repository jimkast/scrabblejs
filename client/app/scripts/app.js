'use strict';

var SCOPE_LETTER = 1;
var SCOPE_WORD = 2;

var HORIZONTAL = 1;
var VERTICAL = 2;

var board = {'data':[
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
    {'type':0, 'tile':{
    'letter': 'P',
    'id': 1,
    'class': 'P',
    'points': 2
    }, 'placed':true},
    {'type':0},
    {'type':0},
    {'type':3},
    {'type':0}
  ],
  [
    {'type':0},
    {'type':0},
    {'type':3},
    {'type':0},
    {'type':0},
    {'type':0},
    {'type':1},
    {'type':0},
    {'type':1},
    {'type':0},
    {'type':0},
    {'type':0},
    {'type':3},
    {'type':0},
    {'type':0},
  ],
  [
    {'type':1},
    {'type':0},
    {'type':0},
    {'type':3},
    {'type':0},
    {'type':0},
    {'type':0},
    {'type':1},
    {'type':0},
    {'type':0},
    {'type':0},
    {'type':3},
    {'type':0},
    {'type':0},
    {'type':1},
  ],
  [
    {'type':0},
    {'type':0},
    {'type':0},
    {'type':0},
    {'type':3},
    {'type':0},
    {'type':0},
    {'type':0},
    {'type':0},
    {'type':0},
    {'type':3},
    {'type':0},
    {'type':0},
    {'type':0},
    {'type':0}
  ],
  [
    {'type':0},
    {'type':2},
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
    {'type':2},
    {'type':0}
  ],
  [
    {'type':0},
    {'type':0},
    {'type':1},
    {'type':0},
    {'type':0},
    {'type':0},
    {'type':1},
    {'type':0},
    {'type':1},
    {'type':0},
    {'type':0},
    {'type':0},
    {'type':1},
    {'type':0},
    {'type':0},
  ],
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
    {'type':4},
  ],
   [
    {'type':0},
    {'type':0},
    {'type':1},
    {'type':0},
    {'type':0},
    {'type':0},
    {'type':1},
    {'type':0},
    {'type':1},
    {'type':0},
    {'type':0},
    {'type':0},
    {'type':1},
    {'type':0},
    {'type':0},
  ],
  
  [
    {'type':0},
    {'type':2},
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
    {'type':2},
    {'type':0}
  ],
  [
    {'type':0},
    {'type':0},
    {'type':0},
    {'type':0},
    {'type':3},
    {'type':0},
    {'type':0},
    {'type':0},
    {'type':0},
    {'type':0},
    {'type':3},
    {'type':0},
    {'type':0},
    {'type':0},
    {'type':0}
  ],
  [
    {'type':1},
    {'type':0},
    {'type':0},
    {'type':3},
    {'type':0},
    {'type':0},
    {'type':0},
    {'type':1},
    {'type':0},
    {'type':0},
    {'type':0},
    {'type':3},
    {'type':0},
    {'type':0},
    {'type':1},
  ],
  [
    {'type':0},
    {'type':0},
    {'type':3},
    {'type':0},
    {'type':0},
    {'type':0},
    {'type':1},
    {'type':0},
    {'type':1},
    {'type':0},
    {'type':0},
    {'type':0},
    {'type':3},
    {'type':0},
    {'type':0},
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
  ]
],
    'next': function(placeholder, dir){
        var result = false;
        if(dir===HORIZONTAL){
            if(x < this.data[0].length-2){
                result = this.data[placeholder.y][placeholder.x+1];
            }
        }
        if(dir===VERTICAL){
            if(y < this.data.length-2){
                result = this.data[placeholder.y+1][placeholder.x];
            }
        }
        return result;
    },

    'prev': function(placeholder, dir){
        var result = false;
        if(dir===HORIZONTAL){
            if(x > 0){
                result = this.data[placeholder.y][placeholder.x-1];
            }
        }
        if(dir===VERTICAL){
            if(y > 0){
                result = this.data[placeholder.y+-1][placeholder.x];
            }
        }
        return result;
    }
};


var letters = [
    {'letter': 'Α','class': 'A','points': 1},
    {'letter': 'Β','class': 'B','points': 8},
    {'letter': 'Γ','class': 'G','points': 4},
    {'letter': 'Δ','class': 'D','points': 4},
    {'letter': 'Ε','class': 'E','points': 1},
    {'letter': 'Ζ','class': 'Z','points': 10},
    {'letter': 'Η','class': 'H','points': 1},
    {'letter': 'Θ','class': 'U','points': 10},
    {'letter': 'Ι','class': 'I','points': 1},
    {'letter': 'Κ','class': 'K','points': 2},
    {'letter': 'Λ','class': 'L','points': 3},
    {'letter': 'Μ','class': 'M','points': 3},
    {'letter': 'Ν','class': 'N','points': 1},
    {'letter': 'Ξ','class': 'J','points': 10},
    {'letter': 'Ο','class': 'O','points': 1},
    {'letter': 'Π','class': 'P','points': 2},
    {'letter': 'Ρ','class': 'R','points': 1},
    {'letter': 'Σ','class': 'S','points': 1},
    {'letter': 'Τ','class': 'T','points': 1},
    {'letter': 'Υ','class': 'Y','points': 2},
    {'letter': 'Φ','class': 'F','points': 8},
    {'letter': 'Χ','class': 'X','points': 8},
    {'letter': 'Ψ','class': 'C','points': 10},
    {'letter': 'Ω','class': 'W','points': 3}
];




var placeHolderTypes = [{
    cssClass: 's1',
    callback: function(tile) {
        return;
    }
}];





var testTileList = [{
    'letter': 'P',
    'id': 1,
    'class': 'P',
    'points': 2
}, {
    'letter': 'A',
    'id': 4,
    'class': 'A',
    'points': 1
}, {
    'letter': 'O',
    'id': 1,
    'class': 'O',
    'points': 2
}, {
    'letter': 'E',
    'id': 1,
    'class': 'E',
    'points': 2
}, {
    'letter': 'K',
    'id': 1,
    'class': 'K',
    'points': 2
}, {
    'letter': 'D',
    'id': 1,
    'class': 'D',
    'points': 2
}, {
    'letter': 'I',
    'id': 1,
    'class': 'I',
    'points': 2
}];


var testBucket = [];

var testPlaceholderList = [{
    type: 's3'
}, {
    type: 's2'
}, {
    type: 's1'
}, {
    type: ''
}, {
    type: 's2'
}, {
    type: 's2'
}, {
    type: 's2'
}, {
    type: 's2'
}, {
    type: 's2'
}];







angular
    .module('ngScrabbleApp', [
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ngRoute',
        'ui.sortable'
    ])
// .config(function($routeProvider) {
//     $routeProvider
//         .when('/', {
//             templateUrl: 'views/main.html',
//             controller: 'MainCtrl'
//         })
//         .otherwise({
//             redirectTo: '/'
//         });
// })


.controller('boardCtrl', ['$scope',
    function($scope) {


        // Data Initialization
        $scope.bucket = testBucket;
        $scope.tilesList = testTileList;
        $scope.placeholderList = testPlaceholderList;
        $scope.rowsList = board.data;
        $scope.holders = [{
            'class': 's0'
        }, {
            'class': 's1',
            'scope': SCOPE_LETTER,
            'func': function(letter_points){
                return {
                    'points': letter_points*2,
                    'string': letter_points + 'x2'
                }
            }
        }, {
            'class': 's2',
            'scope': SCOPE_LETTER,
            'func': function(letter_points){
                return {
                    'points': letter_points*3,
                    'string': letter_points + 'x3'
                }
            }
        }, {
            'class': 's3',
            'scope': SCOPE_WORD,
            'func': function(word_points){
                return {
                    'points': word_points*2,
                    'string': 'x2'
                }
            }
        },
        {
            'class': 's4',
            'scope': SCOPE_WORD,
            'func': function(word_points){
                return {
                    'points': word_points*3,
                    'string': 'x3'
                }
            }
        }];


        // Helpers for DOM Manipulation 
        $scope.tileSelected = undefined;
        $scope.placeholderSelected = undefined;
        $scope.curRow = undefined;
        $scope.curCol = undefined;
        $scope.curDir = undefined;


        $scope.tileSelect = function(index) {
            $scope.tileSelected = index;
        }

        $scope.placeholderSelect = function(placeholder, row, col) {
            $scope.placeholderSelected = placeholder;
            $scope.curRow = row;
            $scope.curCol = col;
        }

        // Move Tiles Tile
        $scope.addTile = function() {
            if ($scope.placeholderSelected.tile == undefined) {
                $scope.placeholderSelected.tile = $scope.tilesList.splice($scope.tileSelected, 1)[0];
                
                if($scope.checkRow($scope.placeholderSelected.tile.row, $scope.placeholderSelected.tile.col)){
                    $scope.placeholderSelected.tile.row = $scope.curRow;
                    $scope.placeholderSelected.tile.col = $scope.curCol;
                }
            }
        }

        $scope.removeTile = function() {
            var boardSelected = $scope.placeholderSelected;
            if(!boardSelected.placed){
                $scope.tilesList.push(boardSelected.tile);
                boardSelected.tile = undefined;
            }
        }

        $scope.checkRow = function(row,col){
            return row != $scope.curRow || col != $scope.curCol;
        }

        $scope.validateMove = function(move){

        }





        function findMoveLetters(board){

            var moveLetters = [];
            board.forEach(function(row, rowIndex){
                row.forEach(function(placeholder, colIndex){
                    if(placeholder.tile && !placeholder.placed){
                        // placeholder.x = colIndex;
                        // placeholder.y = rowIndex;
                        moveLetters.push(placeholder);
                    }
                })
            })
            console.log(moveLetters);
            return moveLetters;
        }


        function findDirection(arr){
            var dir = HORIZONTAL;
            if(arr.length > 1 && arr[0].y==arr[1].y){
                dir = VERTICAL;
            }
            return dir;
        }

        function isAlignedMove(arr){

            if(!(arr.length && arr[0].x && arr[0].y)) return false;

            var curRow = arr[0].x;
            var curCol = arr[0].y;
            var isAligned = true;

            for(var i=1; i<arr.length;i++){
                isAligned = isAligned && (arr[i].x == curRow || arr[i].y == curCol);
            }


            return isAligned;
        }


        function hasTile(placeholder){
        	return (placeholder.placed==true);
        }


        function isConnectMove(arr){

            if(!(arr.length && arr[0].x && arr[0].y)) return false;

            var curRow = arr[0].x;
            var curCol = arr[0].y;
            var isConnected = false;

            var boardCenterY = Math.floor($scope.rowsList.length/2);
            var boardCenterX = Math.floor($scope.rowsList[0].length/2);

            // Check if is first move
            for(var i=0; i<arr.length && !isConnected; i++){
                isConnected = (arr[i].x==boardCenterX && arr[i].y==boardCenterY);
            }

            // check if any beightbour tile is connected
            for(var i=0; i<arr.length && !isConnected; i++){
                var neighbourFilledTiles = findNeighbourTiles(arr[i].x, arr[i].y, $scope.rowsList, true);
                isConnected = neighbourFilledTiles.length > 0;
            }

            return isConnected;
        }



        function findNeighbourTiles(x , y , arr, filledOnly){
            
            if(x < 0 || y < 0) return false;

            var foundTiles = [];

            for(var i=Math.max(y-1, 0); i<=Math.min(y+1, arr.length-1); i++){
            	for(var j=Math.max(x-1, 0); j<=Math.min(x+1, arr[0].length-1); j++){
            		if(i==y || j==x){
	            		if(!filledOnly || hasTile(arr[i][j])){
	            			foundTiles.push(arr[i][j]);
	            		}
	            	}
            	}
            }
            return foundTiles;
        }


        function hasGaps(){
        	
        }





        function checkMove(move){
            
            var result = isAlignedMove(move) && isConnectMove(move);
            console.log('result:', result, 'isAligned:', isAlignedMove(move), 'isConnected:', isConnectMove(move));
            return result;
        }


        $scope.parseMove = function(){
            $scope.move = {};
            $scope.move.moveLetters = findMoveLetters($scope.rowsList);

            var isValidMove = checkMove($scope.move.moveLetters);
            if(isValidMove){
                $scope.move.direction = findDirection($scope.move.moveLetters);
                $scope.parseWord($scope.move.moveLetters[0], $scope.move.direction);
            }
        }



         function findWordStartFromPlaceholder(dir, placeholder){
            var i = 0;
            var pl = false;
            while(!$scope.rowsList.prev(placeholder, dir) && i++ < 15){
                var pl = $scope.rowsList.prev(placeholder, dir);
            }
            return pl;

        }

        $scope.parseWord = function(word_tile, dir){
            
            var points_counter = 0;
            var word_callback_functions = [];
            var calc_str = '';
            var str = '';

            // Find first word start
            cur_placeholder = findWordStartFromPlaceholder(dir, word_tile);

            while(!isEmptyTile(cur_placeholder)){

                var tile_points = 0;
                var placeholder_type = holders[cur_placeholder.type];
                str += cur_placeholder.tile.letter;
                calc_str += cur_placeholder.tile.letter;

                if(cur_placeholder.placed){
                    tile_points = cur_placeholder.tile.points;
                }
                else{
                    if(placeholder_type.scope == SCOPE_LETTER && typeof placeholder_type.func === 'function' ){
                        var func_result = placeholder_type.func(cur_placeholder.tile.points)
                        tile_points = func_result.points;
                        calc_str += func_result.string;
                    }
                    else if(placeholder_type.scope == SCOPE_WORD && typeof placeholder_type.func === 'function' ){
                        word_callback_functions.push(placeholder_type.func);
                    }
                    else{
                        tile_points = cur_placeholder.tile.points;
                    }
                }

                cur_placeholder = board.next(cur_placeholder, dir);
            } // endwhile

            points_counter += tile_points;

            if(word_callback_functions.length > 0){
                calc_str = '(' + calc_str + ')';
                word_callback_functions.forEach(function(func){
                    var func_result = func(points_counter)
                    points_counter = func_result.points;
                    calc_str += func_result.string;
                });
            }

            return {
                'string': str,
                'points': points_counter,
                'calc_str': calc_str
            }
           

        }


    }
]);
