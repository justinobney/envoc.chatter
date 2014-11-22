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
      return _.where(input, function(channel, idx){
        var found = _.find(session.channels, {name: channel.name});
        return found;
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
      return _.where(input, function(channel, idx){
        var found = _.find(session.channels, {name: channel.name});
        return !found;
      }).length;
    };
  }

  function inactiveChannel(session, fbutil) {
    return function(input) {
      return _.where(input, function(channel, idx){
        var found = _.find(session.channels, {name: channel.name});
        return !found;
      });
    };
  }

  angular.module('common.filters.uppercase')
    .filter('inactiveChannelCount', inactiveChannelCount)
    .filter('inactiveChannel', inactiveChannel);
})();
