if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault("counter", 0);

  Template.body.helpers({
    games: function() { return Game.find() },
  });

  Template.body.events({
    "submit .end-turn": function(event) {
      event.preventDefault();
      Meteor.call("endTurn");
    },
    "submit .new-game": function(event) {
      event.preventDefault();

      Meteor.call("setUpBoard");
      Meteor.call("resetGames");

      var players = Player.find().fetch();
      var territories = Territory.find().fetch();
      var maxArmiesPerPlayer = 35;
      var maxTerritoriesPerPlayer = territories.length / players.length

      // Create game
      var gameId = Game.insert({
        name: "Game",
        players: players,
        currentPlayer: players[0]
      });

      // Create occupations for each territory/player
      var territoryIndex = 0;
      for (var n = 0; n < players.length; n++) {
        var player = players[n];
        var armiesPerTerritory = Math.floor(maxArmiesPerPlayer / maxTerritoriesPerPlayer)
        console.log(armiesPerTerritory);

        for (var x = 0; x < maxTerritoriesPerPlayer; x++) {
          Occupation.insert({
            game: gameId,
            player: player._id,
            territory: territories[territoryIndex],
            armies: armiesPerTerritory,
          });
          territoryIndex++;
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
