var _ = require("lodash");
var Firebase = require("firebase");
var responses = require('./responses');
var config = require('./config');

var refs = {};
var root = new Firebase(config.firebase_url);

var commandMap = {
  'ask': askHandler,
  'close': closeHandler,
  'kick': kickHandler
};

refs._messages = root.child('messages');
refs._profiles = root.child('profiles');
refs._commands = root.child('commands');

module.exports.init = function() {
  refs._commands.once("value", getIntialCommands);

  refs._commands.on("child_added", handleNewCommand);

  function getIntialCommands(snapshot) {
    refs._commands.initialized = true;
    console.log('initialized command listener');
  }

  function handleNewCommand(snapshot) {
    if (!refs._commands.initialized == true) {
      return;
    }

    var commandMeta = snapshot.val();
    var handler = commandMap[commandMeta.command.name];

    if(handler){
      handler(commandMeta);
    }
  }
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

function closeHandler(commandMeta){
  var targetChannel = refs._messages.child(commandMeta.channel);
  var username = commandMeta.user.name;
  var msg = {
    text: username + ' left the channel',
    default: true
  };

  targetChannel.push(msg)
  removeFromChannel(commandMeta.uid, commandMeta.channel);
}

function kickHandler(commandMeta){
  var mentions = commandMeta.command.mentions

  refs._profiles.on('value', function(snapshot){
    var people = snapshot.val();

    _.forEach(people, function(person, uid){
      var match = _.contains(mentions, '@' + person.name)
      if(match){
        removeFromChannel(uid, commandMeta.channel);
      }
    });
  });
}

function removeFromChannel(uid, channel){
  console.log('kicking: ', uid, ' from: ', channel);
  var path = ['preferences', uid, 'channels'].join('/');
  var userPrefs = root.child(path)
  userPrefs.once('value', function(snapshot){
    var channels = snapshot.val();
    _.forEach(channels, function(value, key){
      if(value.name === channel){
        userPrefs.child(key).remove();
      };
    });
  })
}
