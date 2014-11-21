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

  function highlighWords($sce, session) {
    return function(text) {
      var words = session.prefs.highlightWords;

      if(!words){
        return $sce.trustAsHtml(text);
      }

      words.split(',').forEach(function(word){
        word = word.trim();
        text = text.replace(new RegExp(word, 'gi'), '<span class="highlight">' + word + '</span>');
      });

      return $sce.trustAsHtml(text);
    };
  }

  angular.module('common.filters.highlighWords', [])
    .filter('highlighWords', highlighWords);
})();

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
