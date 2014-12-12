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

  d3.json("/json/map_topojson_3.json", function(error, world) {

    var countries = topojson.feature(world, world.objects.map).features;

    svg.selectAll(".country")
        .data(countries)
      .enter().insert("path", ".graticule")
        .attr("class", "territory")
        .attr("d", path)
        .attr("data-territory", function(d) { return d.id; })
        .on("click", function (territory, index) {
          d3.event.stopPropagation();
          window.TerritoryUI.territoryClicked(d3.event.target.getAttribute("data-territory"));
        })
  });

  d3.select(self.frameElement).style("height", height + "px");

  $("#map svg").click(function() {
    window.TerritoryUI.clearTerritories();
  });
}

window.TerritoryUI = {
  firstTerritory: "",
  secondTerritory: "",
  assignFirstTerritory: function(territory) {
    $("[data-js~='first-territory']").text(territory)
    $("#map svg path[data-territory='" + territory + "']").attr("class", "territory territory--first");
    $("#map svg").attr("class", "first-territory-on");
  },
  assignSecondTerritory: function(territory) {
    $("[data-js~='second-territory']").text(territory)
    $("#map svg path[data-territory='" + territory + "']").attr("class", "territory territory--second");
    $("#map svg").attr("class", "first-territory-on second-territory-on");
  },
  clearTerritories: function() {
    this.firstTerritory = "";
    $("[data-js~='first-territory']").text("")

    this.secondTerritory = "";
    $("[data-js~='second-territory']").text("")

    $("#map svg path").attr("class", "territory");
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
