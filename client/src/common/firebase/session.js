(function() {
  'use strict';

  function session($state, auth, fbutil) {
    var sessionData = {};
    auth.$onAuth(onAuth);
    return sessionData;

    function onAuth(authObj){
      if(authObj){
        sessionData.user = fbutil.syncObject(['profiles', authObj.uid]);
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
