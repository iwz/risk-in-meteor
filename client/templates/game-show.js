Template.game.helpers({
  currentPlayerName: function() {
    player = Player.findOne(this.currentPlayer);
    return player.name;
  }
})

