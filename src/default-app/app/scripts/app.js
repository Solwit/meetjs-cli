(function () {
  'use strict';

  define([
    'angular',
    'ui-router',
    'meet.js.app.main'
  ], function (angular) {
    return angular.module('meet.js.app', [
      'ui.router',
      'meet.js.app.main'
    ]);
  });

})();
