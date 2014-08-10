app.controller('GameController', ['$scope', 'GameInterface', 'UserManagement',

    function($scope, GameInterface, UserManagement) {



        // SocketService.after(function() {
        //     $scope.$apply();
        // });


        $scope.board = $scope.game.board;
        $scope.tilesList = $scope.game.getUser($scope.me.username).tiles;



        $scope.game.onStart = function() {
            $scope.$apply();
        }

        $scope.game.onEnd = function(data) {
            alert('GAME ENDED' + data);
            $scope.$apply();
        }

        $scope.game.onQuit = function() {
            $scope.$apply();
        }


        $scope.game.onFold = function() {
            $scope.tileSelect($scope.tilesList.get(0));
            $scope.$apply();
        }

        $scope.game.onTurn = function() {
            $scope.myTurn = $scope.game.getUser($scope.me.username).isPlaying;
            $scope.$apply();
        }

        $scope.game.onNewMove = function(username, move) {
            $scope.unplaceAll();
            $scope.$apply();
        }

        $scope.game.onTilesGet = function(username, tiles) {
            $scope.tileSelect($scope.tilesList.get(0));
            $scope.$apply();
        }







        $scope.quit = function() {
            GameInterface.sendQuit($scope.game.id, $scope.tilesList.tiles);
        }

        $scope.fold = function() {
            GameInterface.sendFold($scope.game.id, getSelectedTiles());
            $scope.foldEnabled = false;
        }

        $scope.submitMove = function() {

            var playLetters = $scope.board.getPlayLetters();

            if (playLetters.length === 0) {
                console.log('no letters played');
                return;
            }

            var move = new scrabble.Move(playLetters);

            console.log(move, "NEW MOVE");

            var isValidMove = move.isValid($scope.board.isEmpty);

            if (isValidMove) {
                GameInterface.sendNewMove($scope.game.id, move.getRaw());
                // var results = move.parse();
            }
        }




        



        // -------- CONTROLLER PLAYING WITH TILES
        var unplaceTile = function(placeholder) {
            if (placeholder.isPlayHolder()) {
                var tile = placeholder.getTile();
                tile.selected = false;
                $scope.tilesList.pushTile(tile);
                placeholder.removeTile();
            }
        }

        var unselectAllTiles = function() {
            var total = $scope.tilesList.getRemaining();
            for (var i = 0; i < total; i++) {
                $scope.tilesList.get(i).selected = false;
            }
        }

        var getSelectedTiles = function() {
            return $scope.tilesList.tiles.filter(function(tile) {
                return tile.selected;
            })
        }


        $scope.placeholderSelect = function(placeholder) {
            $scope.placeholderSelected = placeholder;
        }

        $scope.tileSelect = function(tile) {
            if (!tile) return;
            if (!$scope.foldEnabled) {
                unselectAllTiles();
            }
            tile.selected = !tile.selected;
        }

        $scope.placeSelected = function() {

            var selectedTile = getSelectedTiles()[0];

            if (!$scope.foldEnabled && selectedTile && !$scope.placeholderSelected.isFilled()) {
                $scope.placeholderSelected.receiveTile(selectedTile);

                var posInTilelist = $scope.tilesList.indexOf(selectedTile);
                $scope.tilesList.pickTile(posInTilelist);

                var index = Math.max(Math.min(posInTilelist, $scope.tilesList.getRemaining() - 1), 0);
                $scope.tileSelect($scope.tilesList.get(index));
            }
        }

        $scope.unplaceSelected = function() {
            unplaceTile($scope.placeholderSelected);
        }

        $scope.unplaceAll = function() {
            var playLetters = $scope.board.getPlayLetters();
            playLetters.forEach(function(placeholder) {
                unplaceTile(placeholder);
            });
        }


        $scope.foldStart = function() {
            $scope.foldEnabled = true;
            $scope.unplaceAll();
            unselectAllTiles();
        }

        $scope.foldUndo = function() {
            $scope.foldEnabled = false;
            unselectAllTiles();
        }


    }
]);
