'use strict';

/**
 * @ngdoc directive
 * @name jb3App.directive:globalMenu
 * @description
 * # globalMenu
 */
angular.module('jb3App')
    .directive('globalMenu', function () {
        return {
            templateUrl: '/views/directives/global-menu.html',
            restrict: 'E',
            replace: true,
            scope: {
                open: '='
            },

            controller: 'GlobalMenuCtrl'
        };
    });



angular.module('jb3App')
  .controller('GlobalMenuCtrl', function ($scope) {
      $scope.openMenu = function () {
                    $scope.open = true;
                };

                $scope.closeMenu = function () {
                    $scope.open = false;
                };

                $scope.isMenuOpen = function () {
                    return $scope.open;
                };

  });
