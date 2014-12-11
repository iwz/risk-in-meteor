Meteor.methods({
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
      { name: game.name },
      { $set: { currentPlayer: players.fetch()[playerIndex] } }
    )
  }
})
