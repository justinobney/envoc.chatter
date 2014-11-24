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
        resolve: {
          prefs: function(session) {
            return session.prefs.$loaded();
          }
        },
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
  function ChannelCtrl($scope, $stateParams, $q, $timeout, fbutil, session) {
    var channel = this;
    var name = $stateParams.channel;
    var ref = ['messages', name].join('/');
    var msgRef = fbutil.ref(ref);

    channel.name = name;
    channel.prompt = [];

    channel.messages = fbutil.syncArray(ref);
    channel.people = fbutil.syncArray('profiles');
    channel.commands = fbutil.syncArray('commands');
    channel.decisions = fbutil.syncArray(['decisions', name]);
    channel.channelMeta = fbutil.syncObject(['channels', name]);

    channel.addMessage = handleNewMessage;
    channel.trackTyping = trackTyping;
    channel.whoIsTyping = whoIsTyping;

    init();

    function init() {
      bindEvents();
      initNotifications();
      buildPersonAutoComplete();
      setChannelActive();
    }

    function bindEvents() {
      msgRef.on('child_added', onMessageReceived);
      msgRef.once('value', function() {
        console.log('listening for messages in: ' + channel.name);
        msgRef.initialized = true;
      });

      $scope.$on('$destroy', cleanup);

      channel.channelMeta.$bindTo($scope, 'typingTracker');
      $scope.$watch('typingTracker', function(curr, prev){});
    }

    function cleanup() {
      msgRef.off();
      msgRef.off('value');
    }

    function setChannelActive() {
      session.activeChannel = name;
      session.channels.$loaded().then(function(data) {

        channel.thisChannel = _.find(session.channels, {
          name: name
        });

        if (!channel.thisChannel) {
          session.channels.$add({
            name: name
          });
        }

        updateLastMessage();
      });
    }

    function handleNewMessage() {
      var isCommand = channel.newMessage[0] === '/';

      if (isCommand) {
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

    function parseCommand(input) {
      var mentionsRegex = /@(\w+)/gi;
      var mentions = input.match(mentionsRegex);
      var pieces = input.split(' ');
      var commandName = pieces.shift().substring(1);
      var args = pieces.join(' ').replace(mentionsRegex, '').trim();
      return {
        name: commandName,
        arguments: args,
        mentions: mentions
      };
    }

    function addUserMessage() {
      var msg = {
        text: channel.newMessage,
        user: session.user,
        timestamp: Firebase.ServerValue.TIMESTAMP,
        type: 'message'
      };

      channel.messages.$add(msg);
    }

    function updateLastMessage() {
      if (!channel.thisChannel) {
        return;
      }

      channel.thisChannel.lastMsg = Firebase.ServerValue.TIMESTAMP;
      session.channels.$save(channel.thisChannel);
      console.log('updateLastMessage', channel.thisChannel);
    }

    function onMessageReceived(snapshot) {
      if (!msgRef.initialized) {
        return;
      }

      var msg = snapshot.val();

      checkMentions(msg);
      if (!msg.default) {
        updateLastMessage();
      }
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

    function buildPersonAutoComplete() {
      channel.people.$loaded().then(function() {
        var people = _.map(channel.people.slice(), function(person) {
          person.label = person.name;
          return person;
        });
        angular.copy(people, channel.prompt);
      });
    }

    function whoIsTyping() {
      var typing = channel.channelMeta.typing || [];
      typing = typing.slice();

      if (!typing) {
        return '';
      }

      typing = typing.filter(function(name){
        return name !== session.user.name;
      });

      switch (typing.length) {
        case 0:
          return '';
        case 1:
          return typing[0] + ' is typing...';
        case 2:
          return typing.join(' and ') + ' are typing...';
        default:
          return typing[0] + ' and ' + typing.length - 1 + ' are typing...';
      }
    }

    function trackTyping() {
      channel.channelMeta.$loaded().then(function() {
        channel.channelMeta.typing = channel.channelMeta.typing || [];
        var typing = channel.channelMeta.typing;
        var username = session.user.name;

        if (typing.indexOf(username) === -1) {
          typing.push(username);
          channel.channelMeta.$save();
          $timeout(function() {
            channel.channelMeta.typing = _.remove(typing, username);
            channel.channelMeta.$save();
          }, 2000);
        }
      });
    }
  }

  angular.module('home.channel', [])
    .config(config)
    .controller('ChannelCtrl', ChannelCtrl);
})();
