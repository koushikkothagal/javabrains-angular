'use strict';

/**
 * @ngdoc function
 * @name jb3App.controller:CourseCtrl
 * @description
 * # CourseCtrl
 * Controller of the jb3App
 */
angular.module('jb3App')
  .controller('TutorialCtrl', function ($scope, courseDataSvc, $routeParams) {
    $scope.tutName = $routeParams.tutName;
    $scope.tutTitle = $routeParams.tutTitle;

  });
