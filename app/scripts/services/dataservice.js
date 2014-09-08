'use strict';

/**
 * @ngdoc service
 * @name jbAngularApp.dataService
 * @description
 * # dataService
 * Service in the jbAngularApp.
 */
angular.module('jb3App')
  .service('dataService', function dataService($http, $q) {
    // AngularJS will instantiate a singleton by calling "new" on this function
      
        // Return public API.
        return ({
            getData: getData
        });



        // I get all of the friends in the remote collection.
        function getData(fileName) {
            var request = $http({
                method: "get",
                url: fileName,
                params: {
                    action: "get"
                }
            });

            return (request.then(handleSuccess, handleError));

        }

        // ---
        // PRIVATE METHODS.
        // ---


        // I transform the error response, unwrapping the application dta from
        // the API response payload.
        function handleError(response) {

            // The API response from the server should be returned in a
            // nomralized format. However, if the request was not handled by the
            // server (or what not handles properly - ex. server error), then we
            // may have to normalize it on our end, as best we can.
            if (!angular.isObject(response.data) ||
                !response.data.message
            ) {

                return ($q.reject("An unknown error occurred."));

            }

            // Otherwise, use expected error message.
            return ($q.reject(response.data.message));

        }


        // I transform the successful response, unwrapping the application data
        // from the API response payload.
        function handleSuccess(response) {

            return (response.data);

        }
  });



