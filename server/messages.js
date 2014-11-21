var Firebase = require("firebase");
var config = require('./config');
var chatterbot = require('./chatterbot');

var refs = {};
var root = new Firebase(config.firebase_url);

refs._channels = root.child('channels')
refs._messages = root.child('messages')

module.exports.init = function init() {
  refs._channels.on("child_added", onChannelAdded);
  refs._channels.on("child_removed", onChannelRemoved);
}

function onChannelAdded(snapshot) {
  var channel = snapshot.val();
  try {
    makeListener(channel.name);
  } catch (e) {
    console.log(e);
  }
}

function onChannelRemoved(snapshot) {
  var channel = snapshot.val();
  try {
    removeListener(channel.name);
    console.log('removeListener():', channel.name);
  } catch (e) {
    console.log(e);
  }
}

function makeListener(channelName) {
  var messageChannel = refs._messages.child(channelName);

  messageChannel.once("value", onIntialValue);
  messageChannel.on("child_added", onMessageAdded);

  function onIntialValue(snapshot) {
    messageChannel.initialized = true;
    console.log('initialized channel: ', channelName);
  }

  function onMessageAdded(snapshot) {
    if (!messageChannel.initialized == true)
      return;

    var message = snapshot.val();

    chatterbot.process(message, messageChannel);
  }
}

function removeListener(channelName) {
  var messageChannel = refs._messages.child(channelName);
  messageChannel.off("child_added");
}
