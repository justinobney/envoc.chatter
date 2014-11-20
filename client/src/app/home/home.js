(function() {
    'use strict';

    /**
     * @name  config
     * @description config block
     */
    function config($stateProvider) {
        $stateProvider
            .state('root.home', {
                abstract: true,
                resolve: {
                    currentUser: function(auth) {
                        return auth.$requireAuth();
                    }
                },
                views: {
                    '@': {
                        templateUrl: 'src/app/home/home.tpl.html',
                        controller: 'HomeCtrl as home'
                    }
                }
            });
    }

    /**
     * @name  HomeCtrl
     * @description Controller
     */
    function HomeCtrl(channelService, fbutil, session) {
        var home = this;
        var connected = fbutil.ref('/.info/connected');

        home.channels = fbutil.syncObject('channels');
        home.people = fbutil.syncObject('profiles');
        home.addChannel = addChannel;
        session.user.$loaded().then(bindPresence);

        function addChannel() {
            channelService.addChannel(home.channelName);
            home.channelName = '';
        }

        function bindPresence(){
          var presence = fbutil.ref(['profiles', session.uid, 'online']);
          connected.on('value', function(isOnline) {
            presence.set(isOnline.val());
          });

          presence.onDisconnect().remove();
        }
    }

    angular.module('home', [])
        .config(config)
        .controller('HomeCtrl', HomeCtrl);
})();
