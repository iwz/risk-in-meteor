Template.map.rendered = function () {
  this.node = this.find('#map');

  var width = 960,
      height = 700;

  var projection = d3.geo.miller()
      .scale(153)
      .translate([width / 2, height / 2])
      .precision(.1);

  var path = d3.geo.path()
      .projection(projection);

  var svg = d3.select("#map").append("svg")
      .attr("width", width)
      .attr("height", height);

  d3.json("/json/map_topojson.json", function(error, world) {

    var countries = topojson.feature(world, world.objects.map).features;

    svg.selectAll(".country")
        .data(countries)
      .enter().insert("path")
        .attr("class", "territory")
        .attr("d", path)
        .attr("data-territory", function(d) { return d.id; })
        .on("click", function (territory, index) {
          d3.event.stopPropagation();
          window.TerritoryUI.territoryClicked(d3.event.target.getAttribute("data-territory"));
        })

    svg.selectAll(".place-label")
        .data(topojson.feature(world, world.objects.map).features)
      .enter().append("text")
        .attr("class", "place-label")
        .attr("transform", function(d) { return "translate(" + projection(d.geometry.coordinates[0][0]) + ")"; })
        .attr("dy", ".35em")
        .attr("style", "font-family: Helvetica; font-size: 14;")
        .text(function(d) { return d.id; });
  });

  $("#map svg").click(function() {
    window.TerritoryUI.clearTerritories();
  });

  var projection2 = d3.geo.miller()
      .scale(153)
      .translate([width / 2, height / 2])
      .precision(.1);

  var path2 = d3.geo.path()
      .projection(projection2);

  var svg2 = d3.select("#map2").append("svg")
      .attr("width", width)
      .attr("height", height);

  d3.json("/json/world-110m.json", function(error, world) {
    svg2.insert("path")
        .datum(topojson.feature(world, world.objects.land))
        .attr("class", "land")
        .attr("d", path2);
  });
}

window.TerritoryUI = {
  firstTerritory: "",
  secondTerritory: "",
  assignFirstTerritory: function(territory) {
    $("#map svg path[data-territory='" + territory + "']").attr("class", "territory territory--first");
    $("#map svg").attr("class", "first-territory-on");
  },

  assignSecondTerritory: function(territory) {
    $("#map svg path[data-territory='" + territory + "']").attr("class", "territory territory--second");
    $("#map svg").attr("class", "first-territory-on second-territory-on");
  },

  clearTerritories: function() {
    this.firstTerritory = "";
    this.secondTerritory = "";

    $("#map svg path").attr("class", "land");
    $("#map svg").attr("class", "");
  },

  territoryClicked: function (territory) {
    if (this.firstTerritory === "") {
      this.firstTerritory = territory;
      this.assignFirstTerritory(territory);
    } else if (this.secondTerritory === "" &&
               this.firstTerritory != territory) {
      this.assignSecondTerritory(territory);
      this.secondTerritory = territory;
    }
  }
}
