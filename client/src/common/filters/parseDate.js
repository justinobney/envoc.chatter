(function() {
  'use strict';

  function parseDate() {
    return function(input) {
      return new Date(parseInt(input, 10));
    };
  }

  angular.module('common.filters.parseDate', [])
    .filter('parseDate', parseDate);
})();
