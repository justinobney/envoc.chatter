(function() {
  'use strict';

  function session($state, auth) {
    var session = {}
    auth.$onAuth(onAuth);
    return session;

    function onAuth(authObj){
      if(authObj){
        session.user = {
          email: authObj.password.email
        };
      } else {
        session.user = null;
        $state.transitionTo('login');
      }
    }
  }

  angular.module('common.firebase')
    .factory('session', session);
})();
