Game = new Mongo.Collection("games");
Player = new Mongo.Collection("players");
Territory = new Mongo.Collection("territories");
Occupation = new Mongo.Collection("occupations");

if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault("counter", 0);

  Template.body.helpers(
    {
      players: Player.find(),
      territories: Territory.find(),
      games: Game.find(),
      occupations: Occupation.find()
    }
  );


  Template.occupation.helpers({
    player_name: function() {
      player = Player.findOne(this.player)
      return player.name
    },
    territory_name: function() {
      territory = Territory.findOne(this.territory)
      return territory.name
    }
  });

  Template.player.helpers({
    armies: function() {
      occupation = Occupation.find({player: this._id})
      return occupation.armies
    }
  })

  Template.game.helpers({
    currentPlayerName: function() {
      player = Player.findOne(this.currentPlayer)
      return player.name
    }
  })


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

  Template.map.rendered = function () {
    this.node = this.find('#map');

    var width = 960,
        height = 700;

    var projection = d3.geo.miller()
        .scale(153)
        .translate([width / 2, height / 2])
        .precision(.1);

    var path = d3.geo.path()
        .projection(projection);

    var svg = d3.select("#map").append("svg")
        .attr("width", width)
        .attr("height", height);

    d3.json("/json/countries.json", function(error, world) {
      var countries = topojson.feature(world, world.objects.countries).features;

      svg.selectAll(".country")
          .data(countries)
        .enter().insert("path", ".graticule")
          .attr("class", "country")
          .attr("d", path);

      // svg.insert("path")
      //     .datum(topojson.feature(world, world.objects.land))
      //     .attr("class", "land")
      //     .attr("d", path);

      // svg.insert("path")
      //     .datum(topojson.feature(world, world.objects.land))
      //     .attr("class", "land")
      //     .attr("d", path);

      svg.insert("path")
          .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
          .attr("class", "boundary")
          .attr("d", path);
    });

    d3.select(self.frameElement).style("height", height + "px");

  }

  // Template.hello.helpers({
  //   counter: function () {
  //     return Session.get("counter");
  //   }
  // });

  // Template.hello.events({
  //   'click button': function () {
  //     // increment the counter when button is clicked
  //     Session.set("counter", Session.get("counter") + 1);
  //   }
  // });
}

if (Meteor.isServer) {

  Meteor.startup(function () {

    Player.update(
      {
        name: "Player 1",
      },
      {
        name: "Player 1",
      },
      {
        upsert: true
      }
    );

    Player.update(
      {
        name: "Player 2",
      },
      {
        name: "Player 2",
      },
      {
        upsert: true
      }
    );

    Player.update(
      {
        name: "Player 3",
      },
      {
        name: "Player 3",
      },
      {
        upsert: true
      }
    );

    Territory.remove({});

    Territory.insert({
      _id: "1",
      name: "Greenland",
      continent: "North America",
    });

    Territory.insert({
      _id: "2",
      name: "Alaska",
      continent: "North America",
    });

    Territory.insert({
      _id: "3",
      name: "Northwest Territory",
      continent: "North America",
    });

    Territory.insert({
      _id: "4",
      name: "Alberta",
      continent: "North America",
    });

    Territory.insert({
      _id: "5",
      name: "Ontario",
      continent: "North America",
    });

    Territory.insert({
      _id: "6",
      name: "Quebec",
      continent: "North America",
    });

    Territory.insert({
      _id: "7",
      name: "Western United States",
      continent: "North America",
    });

    Territory.insert({
      _id: "8",
      name: "Eastern United States",
      continent: "North America",
    });

    Territory.insert({
      _id: "9",
      name: "Central America",
      continent: "North America",
    });
  });
}

Meteor.methods({
  resetGames: function() {
    Game.remove({});
    Occupation.remove({});
  },
  endTurn: function() {
    var players = Player.find(); // three players, 35 armies each
    var playerIds = players.map(function(player) { return player._id} );
    var game = Game.findOne();
    var currentPlayer = game.currentPlayer;
    var playerIndex = playerIds.indexOf(currentPlayer._id);

    playerIndex++;
    if (playerIndex >= players.count()) {
      playerIndex = 0;
    }

    Game.update(
      {
        name: game.name
      },
      {
        $set: { currentPlayer: players.fetch()[playerIndex] }
      }
    );
  }
});
