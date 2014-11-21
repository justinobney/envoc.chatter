(function() {
  'use strict';

  angular.element(document).ready(function() {
    angular.bootstrap(document, ['app']);
  });

  function config($stateProvider, $urlRouterProvider, $logProvider, $httpProvider) {
    $urlRouterProvider.otherwise('/messages/general');
    // $logProvider.debugEnabled(true);
    $httpProvider.interceptors.push('httpInterceptor');
    $stateProvider
      .state('root', {
        abstract: true,
        resolve: {
          currentUser: function(auth) {
            return auth.$waitForAuth();
          }
        }
      });
  }

  function MainCtrl($log) {
    $log.debug('MainCtrl laoded!');
  }

  function run($log, $rootScope, $state) {
    $rootScope.$on('$stateChangeError', onRouteError);
    $log.debug('App is running!');

    function onRouteError(event, toState, toParams, fromState, fromParams, error){
      if(error === 'AUTH_REQUIRED'){
        $state.transitionTo('login');
      }
    }
  }

  angular.module('app', [
      'ui.router',
      'firebase',
      'login',
      'home',
      'home.channel',
      'home.preferences',
      'common.directives.version',
      'common.directives.userProfile',
      'common.filters.uppercase',
      'common.filters.parseDate',
      'common.filters.highlighWords',
      'common.filters.gravatarHash',
      'common.interceptors.http',
      'common.firebase',
      'common.services',
      'templates',
      'mentio'
    ])
    .config(config)
    .run(run)
    .controller('MainCtrl', MainCtrl)
    .value('version', '1.0.2');
})();
