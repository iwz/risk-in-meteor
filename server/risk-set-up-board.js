Meteor.methods({
  endGame: function() {
    Game.remove({});
    Occupation.remove({});
    Player.remove({});
    Territory.remove({});
    Message.remove({});

    Tracker.flush();
  },

  setUpBoard: function(){
    Meteor.call("newMessage", "You have started a new game!");

    Meteor.call("endGame");

    for( var n = 1; n <= 3; n++ ) {
      Player.insert(
        {
          name: "Player "+n
        }
      );
    }
    var players = Player.find().fetch(); // three players, 35 armies each
    var maxArmiesPerPlayer = 35;

    // Create game
    var gameId = Game.insert({
      name: "Game",
      players: players,
      currentPlayer: players[0]
    });

    Game.update(gameId,
      {
        $set: { currentPlayer: players[0] }
      }
    );

    var world = JSON.parse(Assets.getText("json/map_topojson.json"));
    countries = world.objects.map.geometries;

    var territory_id = 1;
    for (var country in countries) {
      Territory.insert({
        _id: String(territory_id),
        game: gameId,
        name: countries[country].id,
        continent: "North America",
      });

      territory_id ++;
    }

    var territories = Territory.find().fetch();
    var maxTerritoriesPerPlayer = territories.length / players.length

    // Create occupations for each territory/player
    var territoryIndex = 0;
    for (var n = 0; n < players.length; n++) {
      var player = players[n];
      var armiesPerTerritory = Math.floor(maxArmiesPerPlayer / maxTerritoriesPerPlayer)

      for (var x = 0; x < maxTerritoriesPerPlayer; x++) {
        Occupation.insert({
          game: gameId,
          player: player._id,
          territory: territories[territoryIndex]._id,
          armies: armiesPerTerritory,
        });
        territoryIndex++;
      }
    }

  }
});
