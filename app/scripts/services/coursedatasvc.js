'use strict';

/**
 * @ngdoc service
 * @name jb3App.courseDataSvc
 * @description
 * # courseDataSvc
 * Service in the jb3App.
 */
angular.module('jb3App')
  .service('courseDataSvc', function courseDataSvc($resource) {
    // AngularJS will instantiate a singleton by calling "new" on this function

      return {
          getCourses: function(techName) {
            return $resource('/courses/:tech.json', {tech:'@tech'}).get({tech:techName});
          }


      };
  });
