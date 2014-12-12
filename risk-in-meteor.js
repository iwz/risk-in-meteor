if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault("counter", 0);

  Template.messageBoard.helpers({
    messages: function() { return Message.find() }
  })

  Template.body.events({
    "submit .new-game": function(event) {
      event.preventDefault();
      Meteor.call("setUpBoard");
      return false;
    }
  });

  Template.body.helpers({
    games: function() { return Game.find() },
  });

}

Meteor.methods({
  newMessage: function(message) {
    console.log(message)
    Message.insert({
      message: message
    })
  }
});
