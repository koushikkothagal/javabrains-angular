'use strict';

/**
 * @ngdoc overview
 * @name jb3App
 * @description
 * # jb3App
 *
 * Main module of the application.
 */
angular
  .module('jb3App', [
    'ngAnimate',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ui.ace',
    'angulartics', 
    'angulartics.google.analytics'  
  ])
  .config(function ($routeProvider, $locationProvider, $interpolateProvider) {
    $routeProvider
      .when('/', {
        templateUrl: '/views/main.html',
        controller: 'MainCtrl'
      })
      .when('/courses.html', {
        templateUrl: '/views/courses.html',
        controller: 'CoursesCtrl'
      })
      .when('/about.html', {
        templateUrl: '/views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/:techName.html', {
        templateUrl: '/views/course.html',
        controller: 'CourseCtrl'
      })
      .when('/tutorials/:tutName/:tutTitle.html', {
        templateUrl: '/views/tutorial.html',
        controller: 'TutorialCtrl'
      })
      .when('/tutorials/:tutName/quiz/:tutTitle.html', {
        templateUrl: '/views/quiz.html',
        controller: 'TutorialCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
      $locationProvider.html5Mode(true);
      $interpolateProvider.startSymbol('{(').endSymbol(')}');
  });
