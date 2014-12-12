Template.game.helpers({
  launchTerritories: function() {
    var occupations = Occupation.find({
      player: this.currentPlayer._id,
      armies: {$gt: 1}
    });
    return occupations.map(function (occupation) {
      return Territory.findOne(occupation.territory);
    });
  }
});
