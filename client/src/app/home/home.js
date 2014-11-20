(function() {
  'use strict';

  /**
   * @name  config
   * @description config block
   */
  function config($stateProvider) {
    $stateProvider
      .state('root.home', {
        abstract: true,
        resolve: {
          currentUser: function(auth) {
            return auth.$requireAuth();
          }
        },
        views: {
          '@': {
            templateUrl: 'src/app/home/home.tpl.html',
            controller: 'HomeCtrl as home'
          }
        }
      });
  }

  /**
   * @name  HomeCtrl
   * @description Controller
   */
  function HomeCtrl(channelService, fbutil) {
    var home = this;

    home.channels = fbutil.syncObject('channels')
    home.addChannel = addChannel;

    function addChannel(){
      channelService.addChannel(home.channelName);
      home.channelName = '';
    }
  }

  angular.module('home', [])
    .config(config)
    .controller('HomeCtrl', HomeCtrl);
})();
