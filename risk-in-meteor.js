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

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}

Meteor.methods({
  newMessage: function(message) {
    console.log(message);
    Message.insert({
      message: message
    });

    // var el = document.getElementById("messageBoard");
    // el.scrollTop("9999999px");
    // $("#messageBoard").animate({ scrollTop: $("#messageBoard > div")[0].scrollHeight }, 1000);
  }
});

