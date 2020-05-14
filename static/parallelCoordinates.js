//function drawParallelCoordinates_1() {
//
//var margin = {top: 30, right: 10, bottom: 10, left: 0},
//  width = 500 - margin.left - margin.right,
//  height = 400 - margin.top - margin.bottom;
//
//// append the svg object to the body of the page
//var svg = d3.select("#my_dataviz")
//.append("svg")
//  .attr("width", width + margin.left + margin.right)
//  .attr("height", height + margin.top + margin.bottom)
//.append("g")
//  .attr("transform",
//        "translate(" + margin.left + "," + margin.top + ")");
//
//// Parse the Data
//d3.json("/get_parallel_data", function(data) {
//  dimensions = d3.keys(data[0]).filter(function(d) { return d})
//
//  var y = {}
//  for (i in dimensions) {
//    name = dimensions[i]
//    y[name] = d3.scaleLinear()
//      .domain( d3.extent(data, function(d) { return +d[name]; }) )
//      .range([height, 0])
//  }
//
//  x = d3.scalePoint()
//    .range([0, width])
//    .padding(1)
//    .domain(dimensions);
//
//  function path(d) {
//      return d3.line()(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
//  }
//
//  // Draw the lines
//  svg
//    .selectAll("myPath")
//    .data(data)
//    .enter().append("path")
//    .attr("d",  path)
//    .style("fill", "none")
//    .style("stroke", "#69b3a2")
//    .style("opacity", 0.5)
//
//  svg.selectAll("myAxis")
//    .data(dimensions).enter()
//    .append("g")
//    .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
//    .each(function(d) { d3.select(this).call(d3.axisLeft().scale(y[d])); })
//    .append("text")
//      .style("text-anchor", "middle")
//      .attr("y", -9)
//      .text(function(d) { return d; })
//      .style("fill", "black")
//
//})
//
//}


function drawParallelCoordinates(){
console.log("in parallel.....")
var blue_to_brown = d3.scaleLinear()
  .domain([9, 50])
  .range(["steelblue", "brown"])
  .interpolate(d3.interpolateLab);

// interact with this variable from a javascript console
var pc1;

// load csv file and create the chart
d3.json("/get_parallel_data", function(data) {
  pc1 = d3.parcoords()("#example1")
    .data(data)
    .hideAxis(["name"])
    .composite("darken")
    .color(function(d) { return blue_to_brown(d['economy (mpg)']); })  // quantitative color scale
    .alpha(0.35)
    .render()
    .brushMode("1D-axes")  // enable brushing
    .interactive()  // command line mode

  var explore_count = 0;
  var exploring = {};
  var explore_start = false;
  pc1.svg
    .selectAll(".dimension")
    .style("cursor", "pointer")
    .on("click", function(d) {
      exploring[d] = d in exploring ? false : true;
      event.preventDefault();
      if (exploring[d]) d3.timer(explore(d,explore_count));
    });

  function explore(dimension,count) {
    if (!explore_start) {
      explore_start = true;
      d3.timer(pc1.brush);
    }
    var speed = (Math.round(Math.random()) ? 1 : -1) * (Math.random()+0.5);
    return function(t) {
      if (!exploring[dimension]) return true;
      var domain = pc1.yscale[dimension].domain();
      var width = (domain[1] - domain[0])/4;

      var center = width*1.5*(1+Math.sin(speed*t/1200)) + domain[0];

      pc1.yscale[dimension].brush.extent([
        d3.max([center-width*0.01, domain[0]-width/400]),
        d3.min([center+width*1.01, domain[1]+width/100])
      ])(pc1.g()
          .filter(function(d) {
            return d == dimension;
          })
      );
    };
  };

});
}