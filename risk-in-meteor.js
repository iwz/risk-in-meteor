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
    }
  );

  Template.body.events({
    "submit .new-game": function(event) {
      debugger;
      var maxArmies = 35;
      var players = Player.find(); // three players, 35 armies each
      var territories = Territory.find();

      var territoriesByPlayer = [
        ["1", "2"],
        ["3", "4"],
        ["5"],
      ];

      var game = Game.insert({name: "Game 1"});
      // create oocupations for each territory/player
      for (var n = 0; n++; n < players.length) {
        var territories = territoriesByPlayer[n];
        var player = players[n];
        var armiesPerTerritory = maxArmies / territories.length

        for (territory in territories) {
          Occupation.insert({
            game: game,
            player: player.id,
            territory: territory.id,
            armies: armiesPerTerritory,
          });
        }
      }
    }
  });

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
      name: "Indonesia",
      continent: "Australia",
    });

    Territory.insert({
      _id: "2",
      name: "New Guinea",
      continent: "Australia",
    });

    Territory.insert({
      _id: "3",
      name: "LotR",
      continent: "Australia",
    });

    Territory.insert({
      _id: "4",
      name: "Western Australia",
      continent: "Australia",
    });

    Territory.insert({
      _id: "5",
      name: "Eastern Australia",
      continent: "Australia",
    });
  });
}
