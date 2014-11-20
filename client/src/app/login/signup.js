(function() {
  'use strict';

  /**
   * @name  config
   * @description config block
   */
  function config($stateProvider) {
    $stateProvider
      .state('signup', {
        url: '/signup',
        views: {
          '@': {
            templateUrl: 'src/app/login/signup.tpl.html',
            controller: 'SignupCtrl as signup'
          }
        }
      });
  }

  /**
   * @name  SignupCtrl
   * @description Controller
   */
  function SignupCtrl($state, userService) {
    var signup = this;

    signup.name = '';
    signup.email = '';
    signup.password = '';
    signup.submit = onSubmit;

    function onSubmit() {
      var creds = {
        name: signup.name,
        email: signup.email,
        password: signup.password
      };

      userService
        .createUser(creds)
        .then(onCreated);

      function onCreated(){
        $state.transitionTo('root.home.channel', {channel:'general'});
      }
    }

  }

  angular.module('login')
    .config(config)
    .controller('SignupCtrl', SignupCtrl);
})();
