(function() {
  'use strict';

  /**
   * @name  config
   * @description config block
   */
  function config($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        views: {
          '@': {
            templateUrl: 'src/app/login/login.tpl.html',
            controller: 'LoginCtrl as login'
          }
        }
      });
  }

  /**
   * @name  LoginCtrl
   * @description Controller
   */
  function LoginCtrl($state, auth, firebaseConfig) {
    var login = this;
    login.submit = onSubmit;

    login.email = 'jobney@envoc.com';
    login.password = '';

    function onSubmit(){
      var creds = {
        email : login.email,
        password : login.password
      };

      auth.$authWithPassword(creds)
        .then(fbAuthCallback);
    }

    function fbAuthCallback(authData){
      if(authData){
        $state.transitionTo('root.home.channel', {channel:'general'});
      }
    }
  }

  angular.module('login', [
      'common.firebase'
    ])
    .config(config)
    .controller('LoginCtrl', LoginCtrl);
})();
