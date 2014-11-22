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

function onMessageAdded(message, channelName, messageChannel) {
  if (!messageChannel.initialized == true)
    return;

  chatterbot.process(message, messageChannel);

  // update last message
  var timestampPath = [channelName, 'timestamp'].join('/');
  var ts = refs._channels.child(timestampPath);
  ts.set(Firebase.ServerValue.TIMESTAMP);
  console.log(timestampPath);
}

function makeListener(channelName) {
  var messageChannel = refs._messages.child(channelName);

  messageChannel.once("value", onIntialValue);

  messageChannel.on("child_added", function(snapshot){
    onMessageAdded(snapshot.val(), channelName, messageChannel);
  });

  function onIntialValue(snapshot) {
    messageChannel.initialized = true;
    console.log('initialized channel: ', channelName);
  }
}

function removeListener(channelName) {
  var messageChannel = refs._messages.child(channelName);
  messageChannel.off("child_added");
}
