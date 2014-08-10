'use strict';

app.controller('UserController', ['$scope', 'UserInterface', 'UserManagement', 'GamesManagerInterface',
    function($scope, UserInterface, UserManagement, GamesManagerInterface) {


        // new GamesManager()





        $scope.game = {};

        $scope.usersList = UserManagement.users;
        $scope.gamesList = GamesManagerInterface.GamesManager.gamesArray;




        $scope.game = {
            players: 2,
            pack: 'el'
        };


        $scope.languagePacks = {
            el: 'Greek',
            en: 'English',
            de: 'German'
        };

        $scope.isMe = function(){
            return UserManagement.isMe($scope.me.username);
        }

        $scope.me = UserManagement.me();







        $scope.register = UserInterface.register;
        $scope.unregister = UserInterface.unregister;

        $scope.createGame = GamesManagerInterface.createGame;
        $scope.deleteGame = GamesManagerInterface.deleteGame;

        $scope.registerForGame = GamesManagerInterface.registerForGame;
        $scope.unregisterForGame = GamesManagerInterface.unregisterForGame;





        UserInterface.onRegistration = function(username) {

            $scope.gamesList.forEach(function(game) {
                game.registered = game.userIsPlaying($scope.me.username); 
            });

            $scope.$apply();

        }

        UserInterface.onUnregistration = function(username) {
            $scope.$apply();
        }

        UserInterface.onAllUsers = function() {
            $scope.$apply();
        }




        GamesManagerInterface.onUserRegistration = function() {
            if ($scope.isMe()) {
                $scope.gamesList.forEach(function(game){
                   game.registered = game.userIsPlaying($scope.me.username); 
                }) 
            }

            $scope.$apply();
        }


        GamesManagerInterface.onUserUnregistration = function() {
            $scope.$apply();
        }


        GamesManagerInterface.onAllGames = function() {
            $scope.$apply();
        }

        GamesManagerInterface.onCreate = function() {
            $scope.$apply();
        }

        GamesManagerInterface.onDelete = function() {
            $scope.$apply();
        }






        




        UserInterface.ready(function() {

            UserInterface.getAllUsers();
            GamesManagerInterface.getAllGames();

        });








        /*
        $scope.me = UserService.getUser();




        $scope.register = function(username) {
            UserService.register(username);
        }

        UserService.onRegistration(function(user) {
            console.log('SCOPE: got successful registration for user ' + user);
            // $scope.me = user;
            $scope.usersList.push(user);
            $scope.$apply();
        });




        $scope.unregister = function() {
            UserService.unregister();
        }

        UserService.onUnregistration(function(user) {
            console.log('SCOPE: got successful unregistration for user ' + user);
            $scope.usersList.splice($scope.usersList.indexOf(user), 1);
            $scope.$apply();
        });



        UserService.onUsersAll(function(users) {
            $scope.usersList = users;
            $scope.selectedUser = users[0];
            $scope.$apply();
            console.log(users, 'SCOPE: All Users: ');
        });









        var findGame = function(id) {
            var filteredGames = $scope.gamesList.filter(function(game) {
                return game.id === id;
            });
            if (filteredGames.length > 0) {
                return filteredGames[0];
            }
        }



        $scope.createGame = function(name, totalPlayers, languagePack) {
            UserService.createGame(name, totalPlayers, languagePack);
        }

        UserService.onGameCreation(function(game, username) {
            console.log('SCOPE: User ' + username + ' has created a game with id: ' + game.id);
            $scope.gamesList.push(game);

            if (UserService.isMe(username)) {
                $scope.selectedGame = game.id;
            }

            $scope.$apply();
        });





        $scope.registerForGame = function(gameId) {
            UserService.registerForGame(gameId);
        }

        UserService.onUserRegistration(function(gameId, username) {
            console.log('SCOPE: User ' + username + ' has registered for game with id: ' + gameId);
            findGame(gameId).users.push(username);
            if (UserService.isMe(username)) {
                findGame(gameId).registered = true;
            }
            $scope.$apply();
        });




        $scope.unregisterFromGame = function(gameId) {
            UserService.unregisterFromGame(gameId);
        }

        UserService.onUserUnregistration(function(gameId, username) {
            console.log('SCOPE: User ' + username + ' has unregistered from game with id: ' + gameId);
            findGame(gameId).users.splice(findGame(gameId).users.indexOf(username));
            if (UserService.isMe(username)) {
                findGame(gameId).registered = false;
            }
            $scope.$apply();
        });





        $scope.deleteGame = function(gameId) {
            UserService.deleteGame(gameId);
        }

        UserService.onGameDeletion(function(gameId, username) {
            console.log('SCOPE: User ' + username + ' has deleted a game with id: ' + gameId);
            var game = findGame(gameId);
            var pos = $scope.gamesList.indexOf(game);
            $scope.gamesList.splice(pos, 1);
            $scope.selectedGame = $scope.gamesList[pos];
            $scope.$apply();
        });





        UserService.onGamesAll(function(games) {
            if (games && games.length) {
                $scope.gamesList = games;
                $scope.selectedGame = games[0].id;
                $scope.$apply();
            }
            console.log(games, 'SCOPE: All Games: ');
        });





        UserService.ready(function() {

            UserService.getAllUsers();
            UserService.getAllGames();

        });


*/

    }
]);
