Template.game.events({
  "submit .attack" : function(event) {
    event.preventDefault();

    var attackFromVal = $(event.target).find("[name=attackFrom]").val();
    var targetVal = $(event.target).find("[name=target]").val();
    var attackFrom = Occupation.findOne({
      territory: attackFromVal
    });
    var target = Occupation.findOne({
      territory: targetVal
    });

    var defendingPlayer = Player.findOne({_id: target.player});

    Occupation.update(attackFrom._id, {
      $inc: { armies: -3 }
    });

    Occupation.update(target._id, {
      $set: { armies: 3, player: attackFrom.player }
    });

    if (Occupation.find({player: defendingPlayer._id}).count() === 0) {
      console.log(defendingPlayer.name + " defeated!");
      Player.remove({_id: defendingPlayer._id});
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
  }
});
