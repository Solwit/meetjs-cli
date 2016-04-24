(function () {
  'use strict';

  define([
    'meet.js.app.main',
    'ng-mocks'
  ], function () {
    describe('Controller: MainCtrl', function () {

      // load the controller's module
      beforeEach(module('meet.js.app.main'));

      var MainCtrl,
        scope;

      // Initialize the controller and a mock scope
      beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        MainCtrl = $controller('MainCtrl', {
          $scope: scope
        });
      }));

      it('should attach a list of news to the scope', function () {
        expect(scope.allNews.length).toBe(3);

        expect(scope.allNews[0].title).toBe('News 01');
        expect(scope.allNews[1].title).toBe('News 02');
        expect(scope.allNews[2].title).toBe('News 03');
      });
    });
  });
})();
