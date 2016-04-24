(function () {
  'use strict';

  define([
    'require',
    'angular',
    'app',
    'routes',
    'ui-router'
  ], function (require, ng) {
    require(['domReady!'], function (document) {
      ng.bootstrap(document, ['meet.js.app']);
    });
  });
})();
