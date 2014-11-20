(function() {
  'use strict';

  /**
   * @name  config
   * @description config block
   */
  function config($stateProvider) {
    $stateProvider
      .state('root.home.preferences', {
        url: '/preferences',
        views: {
          '': {
            templateUrl: 'src/app/home/preferences/preferences.tpl.html',
            controller: 'UserPreferencesCtrl as user'
          }
        }
      });
  }

  /**
   * @name  userPreferencesCtrl
   * @description Controller
   */
  function UserPreferencesCtrl($scope, session) {
    var prefs = this;

    $scope.bind = {};

    prefs.session = session;
    session.prefs.$bindTo($scope, "bind");
  }

  angular.module('home.preferences', [])
    .config(config)
    .controller('UserPreferencesCtrl', UserPreferencesCtrl);
})();
