(function() {
  'use strict';

  function channelService($firebase, fbutil) {
    /*jshint validthis:true */
    var self = this;
    var messages = fbutil.ref('messages');
    var channels = fbutil.ref('channels');

    self.addChannel = addChannel;

    function addChannel(name) {
      channels.child(name).set({name: name});
      messages.child(name).push({message: 'welcome', default: true});
    }
  }

  angular
    .module('common.services', ['common.firebase'])
    .service('channelService', channelService);
})();
