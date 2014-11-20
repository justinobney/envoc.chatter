(function() {
  'use strict';

  function session($state, auth, fbutil) {
    var session = {}
    auth.$onAuth(onAuth);
    return session;

    function onAuth(authObj){
      if(authObj){
        session.user = fbutil.syncObject(['profiles', authObj.uid]);
      } else {
        session.user.$destroy && session.user.$destroy();
        session.user = null;
        $state.transitionTo('login');
      }
    }
  }

  angular.module('common.firebase')
    .factory('session', session);
})();
