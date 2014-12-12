Meteor.methods({
  setUpBoard: function(){
    console.log("setting up board");

    for( var n = 1; n <= 3; n++ ) {
      Player.update(
        { name: "Player "+n },
        { $set: { name: "Player "+n } }
      );
    }
    console.log("created Players", Player.find().fetch());

    Territory.remove({});

    var world = JSON.parse(Assets.getText("json/map_topojson_3.json"));
    countries = world.objects.map.geometries;

    var territory_id = 1;
    for (var country in countries) {

      Territory.insert({
        _id: String(territory_id),
        name: countries[country].id,
        continent: "North America",
      });

      territory_id ++;
    }
  }
});
