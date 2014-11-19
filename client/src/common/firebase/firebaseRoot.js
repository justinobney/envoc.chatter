(function() {
  'use strict';

  var firebaseConfig = {
    url: 'https://envoc-chatterbox.firebaseio.com/',
    authOptions: { remember: "sessionOnly" }
  }

  function firebaseRoot(firebaseConfig) {
    return new Firebase(firebaseConfig.url);
  }

  angular.module('common.firebase', [])
    .factory('firebaseRoot', firebaseRoot)
    .value('firebaseConfig', firebaseConfig);
})();
