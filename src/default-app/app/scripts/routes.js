(function () {
  'use strict';

  define(['./app'], function (app) {
    return app.config(function ($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.when('', '/main');
      $urlRouterProvider.when('/', '/main');
      $urlRouterProvider.otherwise('/404');

      $stateProvider
        .state('main', {
          url: '/main',
          templateUrl: 'views/main.html',
          controller: 'MainCtrl'
        })
        .state('todo', {
          url: '/todo',
          templateUrl: 'views/todo.html',
          controller: 'TodoCtrl'
        })
        .state('404', {
          url: '/404',
          templateUrl: 'views/errors/404.html'
        });
    });
  });
})();
