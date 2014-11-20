var Firebase = require("firebase");

var refs = {};
var url = 'https://envoc-chatterbox.firebaseio.com/';
var root = new Firebase(url);

refs._channels = root.child('channels')
refs._messages = root.child('messages')

refs._channels.on("child_added", function(snapshot) {
    var channel = snapshot.val();
    makeListener(channel.name);
});

function makeListener(channelName) {
    var messageChannel = refs
        ._messages
        .child(channelName);

    messageChannel.once("value", function(snapshot) {
        messageChannel.initialized = true;
    });

    messageChannel.on("child_added", function(snapshot) {
        if (!messageChannel.initialized == true)
            return;

        var message = snapshot.val();
        if (!isChatterbot(message) && message.text.indexOf('hello') > -1) {
            messageChannel.push({
                text: 'hello, how are  you',
                timestamp: Firebase.ServerValue.TIMESTAMP,
                user: {
                    email: 'chatter@envoc.com',
                    name: 'chatterbot'
                }
            });
        }

        function isChatterbot(msg){
          return msg.user.name == 'chatterbot';
        }
    });
}
