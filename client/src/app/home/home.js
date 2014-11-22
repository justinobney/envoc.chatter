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
  function HomeCtrl($state, channelService, fbutil, session) {
    var home = this;
    var connected = fbutil.ref('/.info/connected');

    home.channels = fbutil.syncArray('channels');
    home.people = fbutil.syncObject('profiles');
    home.addChannel = addChannel;
    home.hasUnread = hasUnread;
    session.user.$loaded().then(bindPresence);

    function addChannel() {
      channelService.addChannel(home.channelName);
      $state.transitionTo('root.home.channel', {channel: home.channelName});
      home.channelName = '';
    }

    function bindPresence() {
      var presence = fbutil.ref(['profiles', session.uid, 'online']);
      connected.on('value', function(isOnline) {
        presence.set(isOnline.val());
      });

      presence.onDisconnect().remove();
    }

    function hasUnread(channel){
      var thisChannel = _.find(session.channels, {name: channel.name});
      if(!thisChannel || !channel.timestamp){
        return false;
      }

      if(channel.timestamp && !thisChannel.lastMsg){
        return true;
      }

      var threshhold = 0.5 * 1000;
      var difference = (channel.timestamp - thisChannel.lastMsg);
      var hasUnread = difference > threshhold;
      console.log(difference, hasUnread);
      if(hasUnread){
        return true;
      }
    }
  }

  angular.module('home', [])
    .config(config)
    .controller('HomeCtrl', HomeCtrl);
})();
