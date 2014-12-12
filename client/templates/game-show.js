Template.game.events({
  "submit .end-turn": function(event) {
    Meteor.call("endTurn");
    return false;
  },
  "submit .end-game": function(event) {
    Meteor.call("endGame");
    return false;
  },
  "submit .attack" : function(event) {
    event.preventDefault();

    // Who is fighting?
    var attackFromVal = $(event.target).find("[name=attackFrom]").val();
    var targetVal = $(event.target).find("[name=target]").val();
    var attackFrom = Occupation.findOne({
      territory: attackFromVal
    });
    var target = Occupation.findOne({
      territory: targetVal
    });
    var defendingPlayer = Player.findOne({_id: target.player});

    // Pit them
    var attackingRoll = rollDice();
    var defendingRoll = rollDice();
    fight(attackingRoll, defendingRoll);

    // Occupation.update(target._id, {
    //   $set: { armies: 3, player: attackFrom.player}
    // });

    if (Occupation.find({player: defendingPlayer._id}).count() === 0) {
      Meteor.call("newMessage", defendingPlayer.name + " defeated!");
      Player.remove({_id: defendingPlayer._id});
    }

    function rollDice() {
      var die1 = rollDie();
      var die2 = rollDie();
      var diceRollValues = [die1, die2].sort();
      return diceRollValues;
    }

    function rollDie(){
      return Math.floor((Math.random()* 6) + 1);
    }

    function fight(attacker, defender) {
      for( n = 0; n < attacker.length; n++ ) {
        if(attacker[n] > defender[n]) {
          kill(target);
          console.log("Attacker wins!");
        } else {
          kill(attackFrom);
          console.log("Defender wins!");
        }
      }
    }

    function kill(occupation) {
      Occupation.update(occupation._id, {
        $inc: { armies: -1 }
      });
    }
  }
});

Template.game.helpers({
  launchTerritories: function() {
    var occupations = Occupation.find({
      player: this.currentPlayer._id,
      armies: {$gt: 1}
    });
    return occupations.map(function (occupation) {
      return Territory.findOne(occupation.territory);
    });
  },
  targets: function() {
    var targets = Occupation.find({
      player: { $not: this.currentPlayer._id },
      armies: {$gt: 1}
    });
    return targets.map(function (target) {
      return Territory.findOne(target.territory);
    });
  },
  occupations: function() { return Occupation.find(); },
  players: function() { return Player.find(); },
  territories: function() { return Territory.find(); },
  gameOver: function() { return Player.find().count() == 1; },
  winningPlayer: function() { return Player.findOne(); },
});
