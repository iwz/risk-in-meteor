Meteor.methods({
  setUpBoard: function(){

    for( var n = 1; n <= 3; n++ ) {
      Player.update(
        { name: "Player "+n },
        { $set: { name: "Player "+n } }
      );
    }

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
  }
});
