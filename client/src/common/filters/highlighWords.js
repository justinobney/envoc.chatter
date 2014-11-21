(function() {
  'use strict';

  function highlighWords($sce, session) {
    return function(text) {
      var mentionsRegex = /@(\w+)/gi;
      var mentions = text.match(mentionsRegex);
      var words = session.prefs.highlightWords;

      if(mentions){
        mentions.forEach(function(mention){
          text = text.replace(new RegExp(mention, 'gi'), '<a>' + mention + '</a>');
        });
      }

      if (!words) {
        return $sce.trustAsHtml(text);
      }

      words.split(',').forEach(function(word) {
        word = word.trim();
        text = text.replace(new RegExp(word, 'gi'), '<span class="highlight">' + word + '</span>');
      });

      return $sce.trustAsHtml(text);
    };
  }

  angular.module('common.filters.highlighWords', [])
    .filter('highlighWords', highlighWords);
})();
