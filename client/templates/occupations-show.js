Template.occupation.helpers({
  player_name: function() {
    player = Player.findOne(this.player);
    return player.name;
  },
  territory_name: function() {
    territory = Territory.findOne(this.territory);
    return territory.name;
  }
});
