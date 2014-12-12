Template.game.events({
  "submit .end-turn": function(event) {
    Meteor.call("endTurn");
    Meteor.call("colorizeDaMap");
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

    // var attackFromVal = $(".territory--first");
    // var targetVal = $(".territory--second");

    var attackFrom = Occupation.findOne({
      territory: attackFromVal
    });
    var target = Occupation.findOne({
      territory: targetVal
    });
    var attackingPlayer = Player.findOne({_id: attackFrom.player});
    var attackingTerritory = Territory.findOne(attackFrom.territory);
    var defendingTerritory = Territory.findOne(target.territory);
    var defendingPlayer = Player.findOne({_id: target.player});

    // Pit them
    var attackingRoll = rollAttackingDice();
    var defendingRoll = rollDefendingDice();

    Meteor.call("newMessage", attackingPlayer.name + " declares war on " + defendingPlayer.name + " in " + defendingTerritory.name +"!");

    fight(attackingRoll, defendingRoll);

    if (target.armies < 1) {
      Meteor.call("newMessage", attackingPlayer.name + " captured " + defendingTerritory.name + "!");

      Occupation.update(attackFrom._id, {
        $inc: { armies: -1}
      });

      Occupation.update(target._id, {
        $set: { armies: 1, player: attackFrom.player}
      });
    }

    if (Occupation.find({player: defendingPlayer._id}).count() === 0) {
      Meteor.call("newMessage", defendingPlayer.name + " defeated!");
      Player.remove({_id: defendingPlayer._id});
    }

    function rollAttackingDice() {
      return [rollDie(), rollDie(), rollDie()].sort();
    }

    function rollDefendingDice() {
      return [rollDie(), rollDie()].sort();
    }

    function rollDie(){
      return Math.floor((Math.random()* 6) + 1);
    }

    function fight(attackingDice, defendingDice) {
      Meteor.call("newMessage", attackingPlayer.name + " rolls: " + attackingDice);
      Meteor.call("newMessage", defendingPlayer.name + " rolls: " + defendingDice);

      attackingDice = attackingDice.splice(3 - defendingDice.length);

      for( n = 0; n < attackingDice.length; n++ ) {
        if (attackingDice[n] > defendingDice[n]) {
          kill(target);
          Meteor.call("newMessage", attackingPlayer.name + " loses 1 army in "+ defendingTerritory.name +"!");
        } else {
          kill(attackFrom);
          Meteor.call("newMessage", defendingPlayer.name + " loses 1 army in "+ attackingTerritory.name +"!");
        }
      }
    }

    function kill(occupation) {
      Occupation.update(occupation._id, {
        $inc: { armies: -1 }
      });
      occupation.armies--;
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
      player: { $not: this.currentPlayer._id }
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
