(function() {
  'use strict';

  function session($state, $timeout, auth, fbutil) {
    var sessionData = {};

    init();
    return sessionData;

    function init(){
      auth.$onAuth(onAuth);
    }

    function onAuth(authObj){
      if(authObj){
        var profilePath = ['profiles', authObj.uid];
        var prefPath = ['preferences', authObj.uid];
        var channelPath = ['preferences', authObj.uid, 'channels'];

        sessionData.user = fbutil.syncObject(profilePath);
        sessionData.prefs = fbutil.syncObject(prefPath);
        sessionData.channels = fbutil.syncArray(channelPath);

        var channelRef = fbutil.ref(channelPath);

        channelRef.on('value', function onDataInit(){
          channelRef.initialized = true;
          console.log('initialized');
        });

        channelRef.on('child_removed', function onChannelLeave(snapshot){
          if(channelRef.initialized !== true){
            return;
          }

          $state.transitionTo('root.home.channel', {channel: 'general'});
        });

        sessionData.uid = authObj.uid;
      } else {
        try {
          sessionData.user.$destroy();
        } catch(e){}
        sessionData.user = null;
        $state.transitionTo('login');
      }
    }
  }

  angular.module('common.firebase')
    .factory('session', session);
})();
