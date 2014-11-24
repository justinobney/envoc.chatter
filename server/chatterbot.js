var Firebase = require("firebase");
var responses = require('./responses');
var urlregexp = require('urlregexp')

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

  checkForUrls(message, messageChannel);
};

function checkForUrls(message, messageChannel){
  var matches = message.text.match(urlregexp);
  if(matches && matches.length){
    var msg = 'there was a url in there... ' +
      'I should learn to take screenshots. Its on my todo list';
    chatBack('', messageChannel, msg);
  }
}

function skipReaction(msg) {
  return msg.default ||
    msg.user.name == 'chatterbot' ||
    msg.type !== 'message';
}

function chatBack(key, channel, overrideText) {
  var msg = {
    timestamp: Firebase.ServerValue.TIMESTAMP,
    user: {
      email: 'chatterbot@envoc.com',
      name: 'chatterbot'
    },
    type: 'message',
  }

  if(responses[key]){
    if(responses[key].text){
      msg.text = responses[key].text;
    }

    if(responses[key].image){
      msg.image = responses[key].image;
    }
  }

  if(overrideText){
    msg.text = overrideText;
  }

  setTimeout(function(msg) {
    channel.push(msg)
  }, 500, msg);
}
