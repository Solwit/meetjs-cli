(function () {
  'use strict';

  define([
    'angular'
  ], function (angular) {
    angular.module('meet.js.app.main', []).controller('MainCtrl', function ($scope) {
      $scope.allNews = [{
        title: 'News 01',
        message: 'Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.'
      }, {
        title: 'News 02',
        message: 'Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.'
      }, {
        title: 'News 03',
        message: 'Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui.'
      }];
    });
  });

})();
