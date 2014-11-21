var Firebase = require("firebase");
var responses = require('./responses');
var config = require('./config');

var refs = {};
var root = new Firebase(config.firebase_url);

refs._channels = root.child('channels')
refs._messages = root.child('messages')

module.exports.init = function init() {
  refs._channels.on("child_added", function(snapshot) {
    var channel = snapshot.val();
    try {
      makeListener(channel.name);
    } catch (e) {
      console.log(e);
    }
  });

  // Get the data on a post that has been removed
  refs._channels.on("child_removed", function(snapshot) {
    var channel = snapshot.val();
    try {
      removeListener(channel.name);
      console.log('removeListener():', channel.name);
    } catch (e) {
      console.log(e);
    }
  });
}

function makeListener(channelName) {
  var messageChannel = refs._messages.child(channelName);

  messageChannel.once("value", function(snapshot) {
    messageChannel.initialized = true;
    console.log('initialized channel: ', channelName);
  });

  messageChannel.on("child_added", function(snapshot) {
    if (!messageChannel.initialized == true)
      return;

    var message = snapshot.val();

    if(skipReaction(message)){
      return;
    }

    Object.keys(responses).forEach(function(key, value) {
      var match = new RegExp(key, 'gi');
      if (match.test(message.text)) {
        chatBack(key, messageChannel);
      }
    })
  });
}

function skipReaction(msg) {
  return msg.default || msg.user.name == 'chatterbot';
}

function chatBack(key, channel) {
  var msg = {
    timestamp: Firebase.ServerValue.TIMESTAMP,
    user: {
      email: 'chatter@envoc.com',
      name: 'chatterbot'
    }
  }

  msg.text = responses[key];
  setTimeout(function(msg) {
    channel.push(msg)
  }, 500, msg);
}

function removeListener(channelName) {
  var messageChannel = refs._messages.child(channelName);
  messageChannel.off("child_added");
}
