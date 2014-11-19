(function() {
  'use strict';

  /**
   * @name  config
   * @description config block
   */
  function config($stateProvider) {
    $stateProvider
      .state('root.home.messages', {
        url: '/messages',
        views: {
          '': {
            templateUrl: 'src/app/home/messages/messages.tpl.html',
            controller: 'MessagesCtrl as messages'
          }
        }
      });
  }

  /**
   * @name  messagesCtrl
   * @description Controller
   */
  function MessagesCtrl($log) {
    var messages = this;
    messages.someMethod = function () {
      $log.debug('I\'m a method');
    };
  }

  angular.module('home.messages', [])
    .config(config)
    .controller('MessagesCtrl', MessagesCtrl);
})();
