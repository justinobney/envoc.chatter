var Firebase = require("firebase");
var responses = require('./responses');

module.exports.process = function process(message, messageChannel) {
  if (skipReaction(message)) {
    return;
  }

  Object.keys(responses).forEach(function(key, value) {
    var match = new RegExp(key, 'gi');
    if (match.test(message.text)) {
      chatBack(key, messageChannel);
    }
  })
};

function skipReaction(msg) {
  return msg.default ||
    msg.user.name == 'chatterbot' ||
    msg.type !== 'message';
}

function chatBack(key, channel) {
  var msg = {
    timestamp: Firebase.ServerValue.TIMESTAMP,
    user: {
      email: 'chatter@envoc.com',
      name: 'chatterbot'
    },
    type: 'message',
  }

  if(responses[key].text){
    msg.text = responses[key].text;
  }

  if(responses[key].image){
    msg.image = responses[key].image;
  }

  setTimeout(function(msg) {
    channel.push(msg)
  }, 500, msg);
}
