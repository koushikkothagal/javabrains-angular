'use strict';

describe('Controller: QuizcontrollerCtrl', function () {

  // load the controller's module
  beforeEach(module('jbAngularApp'));

  var QuizcontrollerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    QuizcontrollerCtrl = $controller('QuizcontrollerCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
