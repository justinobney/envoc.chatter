(function() {
  'use strict';

  /**
   * @name  config
   * @description config block
   */
  function config($stateProvider) {
    $stateProvider
      .state('root.home.channel', {
        url: '/messages/:channel',
        views: {
          '': {
            templateUrl: 'src/app/home/channel/channel.tpl.html',
            controller: 'ChannelCtrl as channel'
          }
        }
      });
  }

  /**
   * @name  channelCtrl
   * @description Controller
   */
  function ChannelCtrl($stateParams, $q, fbutil, session) {
    var channel = this;
    var name = $stateParams.channel;
    var ref = ['messages', name].join('/');
    var msgRef = fbutil.ref(ref);

    channel.name = name;
    channel.prompt = [];
    channel.messages = fbutil.syncArray(ref);
    channel.people = fbutil.syncArray('profiles');
    channel.commands = fbutil.syncArray('commands');
    channel.addMessage = handleNewMessage;

    init();

    function init(){
      notifications();
      buildPersonAutoComplete();
      setChannelActive();
    }

    function setChannelActive(){
      session.channels.$loaded().then(function(){
        session.channels[name] = true;
        session.channels.$save();
      });
    }

    function handleNewMessage() {
      var isCommand = channel.newMessage[0] === '/';

      if(isCommand){
        channel.commands.$add({
          channel: channel.name,
          user: session.user,
          uid: session.uid,
          command: parseCommand(channel.newMessage)
        });
      } else {
        addUserMessage();
      }

      channel.newMessage = '';
    }

    function parseCommand(input){
      var mentionsRegex = /@(\w+)/gi;
      var mentions = input.match(mentionsRegex);
      var pieces = input.split(' ');
      var commandName = pieces.shift().substring(1);
      var args = pieces.join(' ');
      return {
        name: commandName,
        arguments: args,
        mentions: mentions
      };
    }

    function addUserMessage(){
      var msg = {
        text: channel.newMessage,
        user: session.user,
        timestamp: Firebase.ServerValue.TIMESTAMP
      };

      channel.messages.$add(msg);
    }

    function checkMentions(snapshot) {
      if (!msgRef.initialized){
        return;
      }

      var msg = snapshot.val();
      var reg = new RegExp('@' + session.user.name, 'gi');
      if (reg.test(msg.text)) {
        var notification = new Notification('Chatter', {
          body: msg.text
        });
      }
    }

    function notifications() {
      msgRef.on('child_added', checkMentions);
      msgRef.once('value', function() {
        console.log('initialized');
        msgRef.initialized = true;
      });

      if (Notification.permission !== 'granted') {
        Notification.requestPermission();
      }
    }

    function buildPersonAutoComplete(){
      channel.people.$loaded().then(function(){
        var people = _.map(channel.people.slice(), function(person){
          person.label = person.name;
          return person;
        });
        angular.copy(people, channel.prompt);
      });
    }
  }

  angular.module('home.channel', [])
    .config(config)
    .controller('ChannelCtrl', ChannelCtrl);
})();
