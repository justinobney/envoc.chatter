(function() {
  'use strict';

  function auth($firebaseAuth, firebaseRoot) {
    return $firebaseAuth(firebaseRoot);
  }

  angular.module('common.firebase')
    .factory('auth', auth);
})();

(function() {
  'use strict';

  function userService($q, $firebase, firebaseRoot, auth) {
    var svc = {};
    svc.createUser = createUser;

    return svc;

    function createUser(profileData) {
      return auth
        .$createUser(profileData.email, profileData.password)
        .then(onCreated);

      function onCreated(err) {
        if (err) {
          switch (err.code) {
            case 'EMAIL_TAKEN':
              // The new user account cannot be created because the email is already in use.
              break;
            case 'INVALID_EMAIL':
              // The specified email is not a valid email.
              break;
            default:
              return $q.reject(err.code);
          }
          return $q.reject(err.code);
        }
        return createProfile(profileData);
      }
    }

    function createProfile(profileData) {
      return auth
        .$authWithPassword(profileData)
        .then(cbAuthUser);

      function cbAuthUser(auth){
        var dfd = $q.defer();

        var ref = firebaseRoot
          .child('profiles')
          .child(auth.uid);

        ref.set(profileData, onProfileCreated);

        return dfd.promise;

        function onProfileCreated() {
          dfd.resolve();
        }
      }
    }
  }


  angular.module('common.firebase')
    .factory('userService', userService);
})();
