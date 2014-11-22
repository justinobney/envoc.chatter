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

  function ChannelSwitcherCtrl($scope, fbutil) {
    this.channels = fbutil.syncArray('channels');

    $scope.$on('$stateChangeSuccess', function(){
      $scope.closeThisDialog();
    });
  }

  function run($log, $rootScope, $state, hotkeys, ngDialog) {
    $rootScope.$on('$stateChangeError', onRouteError);
    $log.debug('App is running!');
    $rootScope.showChannelSwitcher = showChannelSwitcher;

    bindKeys();

    function onRouteError(event, toState, toParams, fromState, fromParams, error) {
      if (error === 'AUTH_REQUIRED') {
        $state.transitionTo('login');
      }
    }

    function showChannelSwitcher(){
      ngDialog.open({
        template: 'channel-switcher',
        className: 'ngdialog-theme-default',
        controller: 'ChannelSwitcherCtrl as channelSwitcher',
        scope: $rootScope.$new()
      });
    }

    function bindKeys() {
      hotkeys.add({
        combo: 'mod+k',
        description: 'Open channel switcher',
        callback: function() {
          showChannelSwitcher();
          return false;
        }
      });
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
      'mentio',
      'cfp.hotkeys',
      'ngDialog',
      'luegg.directives'
    ])
    .config(config)
    .run(run)
    .controller('MainCtrl', MainCtrl)
    .controller('ChannelSwitcherCtrl', ChannelSwitcherCtrl)
    .value('version', '1.0.2');
})();
