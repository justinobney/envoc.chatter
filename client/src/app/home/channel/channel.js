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
  function ChannelCtrl($scope, $stateParams, $q, fbutil, session) {
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

    channel.commandOptions = [
      {
        label: 'ask', action: 'ask', description: 'ask a question'
      }
    ];

    init();

    function init(){
      bindEvents();
      initNotifications();
      buildPersonAutoComplete();
      setChannelActive();
    }

    function bindEvents(){
      msgRef.on('child_added', onMessageReceived);
      msgRef.once('value', function() {
        console.log('listening for messages in: ' + channel.name);
        msgRef.initialized = true;
      });

      $scope.$on('$destroy', cleanup);
    }

    function cleanup(){
      msgRef.off();
      msgRef.off('value');
    }

    function setChannelActive(){
      session.channels.$loaded().then(function(data){

        channel.thisChannel = _.find(session.channels, {name: name});

        if(!channel.thisChannel){
          session.channels.$add({name: name});
        }

        updateLastMessage();
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

    function updateLastMessage(){
      if(!channel.thisChannel){ return; }

      channel.thisChannel.lastMsg = Firebase.ServerValue.TIMESTAMP;
      session.channels.$save(channel.thisChannel);
      console.log('updateLastMessage', channel.thisChannel);
    }

    function onMessageReceived(snapshot) {
      if (!msgRef.initialized){ return; }

      var msg = snapshot.val();

      checkMentions(msg);
      updateLastMessage();
    }

    function checkMentions(msg) {
      var reg = new RegExp('@' + session.user.name, 'gi');
      if (reg.test(msg.text)) {
        var notification = new Notification('Chatter', {
          body: msg.text
        });
      }
    }

    function initNotifications() {
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
