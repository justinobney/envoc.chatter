(function() {
  'use strict';

  function session($state, auth, fbutil) {
    var sessionData = {};
    auth.$onAuth(onAuth);
    return sessionData;

    function onAuth(authObj){
      if(authObj){
        sessionData.user = fbutil.syncObject(['profiles', authObj.uid]);
        sessionData.prefs = fbutil.syncObject(['preferences', authObj.uid]);
        sessionData.channels = fbutil.syncObject(['preferences', authObj.uid, 'channels']);
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
