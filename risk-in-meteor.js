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
  },
  colorizeDaMap: function() {
    var players = Player.find().fetch();
    for (var i = 0; i < players.length; i++) {
      setCountryClasses(players[i]);
    }

    function setCountryClasses(player) {
      occupations = Occupation.find({
        player: player._id
      }).fetch();

      for (var i = 0; i < occupations.length; i++) {
        territory = Territory.find({
          _id: occupations[i].territory
        }).fetch();

        var countryName = territory[0].name

        var svg = $("[data-territory='" + countryName + "']");
        var playerName = player.name.replace(" ", "_").toLowerCase();

        svg.attr("class", "territory " + playerName);
      }
    }
  }
});

