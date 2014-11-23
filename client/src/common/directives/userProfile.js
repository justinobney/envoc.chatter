(function() {
  'use strict';

  function userProfile(auth, session) {
    return {
      restrict: 'E',
      template: '<div class="user-profile">'+
                  '<span><a ui-sref="root.home.preferences">{{session.user.name}}</a></span>' +
                  '<button class="clickable" type="button" ng-click="logOut()">Log Out</button>' +
                '</div>',
      /*jshint unused:false*/
      link: function(scope, elm, attrs) {
        scope.session = session;
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
