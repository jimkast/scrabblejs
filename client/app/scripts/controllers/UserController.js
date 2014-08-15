'use strict';

app.controller('UserController', ['$scope', 'UserInterface', 'UserManagement', 'GamesManagerInterface', '$cookieStore',
    function($scope, UserInterface, UserManagement, GamesManagerInterface, $cookieStore) {



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

        $scope.isMe = function() {
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
                $scope.gamesList.forEach(function(game) {
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

            UserInterface.login();
            UserManagement.login();


            // GamesManagerInterface.updateAfterLogin();
             // var token; 
             // if (token = $cookieStore.get('token')) {
             //     $scope.$apply();
             // }

            UserInterface.getAllUsers();
            GamesManagerInterface.getAllGames();

        });




    }
]);
