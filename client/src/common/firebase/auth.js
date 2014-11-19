(function() {
  'use strict';

  function auth($firebaseAuth, firebaseRoot) {
    var auth = $firebaseAuth(firebaseRoot);
    return auth;
  }

  angular.module('common.firebase')
    .factory('auth', auth);
})();
