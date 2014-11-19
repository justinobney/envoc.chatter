(function() {
  'use strict';

  function userProfile(auth, session) {
    return {
      restrict: 'E',
      template: '<span>{{session.user.email}}</span>' +
                '<br><button type="button" ng-click="logOut()">Log Out</button>',
      /*jshint unused:false*/
      link: function(scope, elm, attrs) {
        scope.session = session
        scope.logOut = logOut;

        function logOut(){
          auth.$unauth();
        }
      }
    };
  }

  angular.module('common.directives.userProfile', [])
    .directive('userProfile', userProfile);
})();
