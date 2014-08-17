'use strict';

/**
 * @ngdoc function
 * @name jb3App.controller:CourseCtrl
 * @description
 * # CourseCtrl
 * Controller of the jb3App
 */
angular.module('jb3App')
  .controller('CourseCtrl', function ($scope, courseDataSvc, $routeParams) {
        $scope.courses = courseDataSvc.getCourses($routeParams.techName);
        
  });