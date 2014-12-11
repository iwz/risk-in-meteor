if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault("counter", 0);

  Template.body.helpers({
    players: Player.find(),
    territories: Territory.find(),
    games: Game.find(),
    occupations: Occupation.find()
  });

  Template.body.events({
    "submit .end-turn": function(event) {
      event.preventDefault();
      Meteor.call("endTurn");
    },
    "submit .new-game": function(event) {
      event.preventDefault();
      var maxArmies = 35;
      var players = Player.find().fetch(); // three players, 35 armies each

      var territoriesByPlayer = [
        ["1", "2"],
        ["3", "4"],
        ["5"],
      ];

      Meteor.call("resetGames");

      // Create game
      var gameId = Game.insert({
        name: "Game",
        players: players,
        currentPlayer: players[0]
      });

      // create oocupations for each territory/player
      for (var n = 0; n < players.length; n++) {
        var territories = territoriesByPlayer[n];
        var player = players[n];
        var armiesPerTerritory = Math.floor(maxArmies / territories.length)

        for (var x = 0; x < territories.length; x++) {
          Occupation.insert({
            game: gameId,
            player: player._id,
            territory: territories[x],
            armies: armiesPerTerritory,
          });
        }
      }
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    Meteor.call("setUpBoard");
  });
}

Meteor.methods({
  resetGames: function() {
    Game.remove({});
    Occupation.remove({});
  },
});
