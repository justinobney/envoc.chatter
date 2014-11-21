(function() {
  'use strict';

  function uppercase() {
    return function(text) {
      return text ? text.toUpperCase() : text;
    };
  }

  angular.module('common.filters.uppercase', [])
    .filter('uppercase', uppercase);
})();

(function() {
  'use strict';

  function activeChannel(session, fbutil) {
    return function(input) {
      return _.where(input, function(value, key){
        return key[0] !== '$' && session.channels[key];
      });
    };
  }

  angular.module('common.filters.uppercase')
    .filter('activeChannel', activeChannel);
})();

(function() {
  'use strict';

  function inactiveChannelCount(session, fbutil) {
    return function(input) {
      return _.where(input, function(value, key){
        return key[0] !== '$' && !session.channels[key];
      }).length;
    };
  }

  angular.module('common.filters.uppercase')
    .filter('inactiveChannelCount', inactiveChannelCount);
})();
