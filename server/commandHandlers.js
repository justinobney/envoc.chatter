var Firebase = require("firebase");
var responses = require('./responses');
var config = require('./config');

var refs = {};
var root = new Firebase(config.firebase_url);

var commandMap = {
  'ask': askHandler
};

refs._messages = root.child('messages');
refs._commands = root.child('commands');

module.exports.init = function() {
  refs._commands.once("value", function(snapshot) {
    refs._commands.initialized = true;
    console.log('initialized command listener');
  });

  refs._commands.on("child_added", function(snapshot) {
    if (!refs._commands.initialized == true) {
      return;
    }

    var commandMeta = snapshot.val();
    console.log(commandMeta);
    var handler = commandMap[commandMeta.command.command]; //ugh

    if(handler){
      handler(commandMeta);
    }
  });
}

function askHandler(commandMeta){
  var targetChannel = refs._messages.child(commandMeta.channel);
  var username = commandMeta.user.name;
  var mentions = commandMeta.command.mentions.join(', '); //ugh

  var msg = {
    text: 'following users were mentioned in a command by ' + username + ' ' + mentions,
    default: true
  };
  targetChannel.push(msg)
}
