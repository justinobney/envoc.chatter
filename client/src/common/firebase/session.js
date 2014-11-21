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
        sessionData.channels = fbutil.syncObject(channelPath);
        sessionData.channelList = fbutil.syncArray(channelPath);

        var channelRef = fbutil.ref(channelPath);
        channelRef.on('child_removed', function onChannelLeave(snapshot){
          if(sessionData.channelList.length){
            // TODO: i dont fully understand why I have to so this
            $timeout(function(){
              var nextChannel = sessionData.channelList[0].$id;
              $state.transitionTo('root.home.channel', {channel: nextChannel});
            }, 100);
          }
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
