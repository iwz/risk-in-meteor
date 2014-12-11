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
        .attr("data-territory", function(d) { return d.id; });
  });

  d3.select(self.frameElement).style("height", height + "px");
}
