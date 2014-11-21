(function() {
  'use strict';

  function gravatarHash() {
    return function(input) {
      var baseUrl = 'http://www.gravatar.com/avatar/';
      return baseUrl + md5(input);
    };
  }

  angular.module('common.filters.gravatarHash', [])
    .filter('gravatarHash', gravatarHash);
})();
