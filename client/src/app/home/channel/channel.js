(function() {
  'use strict';

  /**
   * @name  config
   * @description config block
   */
  function config($stateProvider) {
    $stateProvider
      .state('root.home.channel', {
        url: '/messages/:channel',
        views: {
          '': {
            templateUrl: 'src/app/home/channel/channel.tpl.html',
            controller: 'ChannelCtrl as channel'
          }
        }
      });
  }

  /**
   * @name  channelCtrl
   * @description Controller
   */
  function ChannelCtrl($stateParams, fbutil, session) {
    var channel = this;

    channel.name = $stateParams.channel;
    channel.messages = fbutil.syncArray(['messages', channel.name]);
    channel.addMessage = addMessage;

    function addMessage(){
      var msg = {
        text: channel.newMessage,
        user: session.user,
        timestamp: Firebase.ServerValue.TIMESTAMP
      };

      channel.messages.$add(msg);
      channel.newMessage = '';
    }
  }

  angular.module('home.channel', [])
    .config(config)
    .controller('ChannelCtrl', ChannelCtrl);
})();
