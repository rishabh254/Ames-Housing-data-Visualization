var groupBy = function(xs, key) {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

function getLineData(data){

	for (var i=0;i<data.length-13;i++)
	{
		data[i]['age'] = data[i]['YrSold1'] - data[i]['YearRemodAdd1'];
		data[i] = {
					age:   data[i].age,
					SalePrice:   data[i].SalePrice1,
					OverallQual: data[i].OverallQual1
				   };
	}
	var result=[]


	groupData = groupBy(data,'age');

	for(i in groupData)
	{
		if(i>=0)
		{
		 sp = groupData[i].reduce((accum,item) => accum + item.SalePrice, 0)/groupData[i].length;
		 oq = groupData[i].reduce((accum,item) => accum + item.OverallQual, 0)/groupData[i].length;
		 ag = groupData[i].reduce((accum,item) => accum + item.age, 0)/groupData[i].length;
		 //console.log(i);
		 result.push({age: ag, SalePrice:sp, OverallQual:oq});
		}
	}
	return result;
}

d_line_graph =[]
var svgLineGraph=null;
var marginLineGraph,widthLineGraph,heightLineGraph;




function drawInitialLineGraph() {
d3.json("/get_mds/euclidean", function(d) {

	d_line_graph = JSON.parse(d.mds_orig);
	drawLineGraph(d_line_graph.slice());
});
}

function updateLineGraph(lineData)
{
	if(svgLineGraph!=null)
	{
	data = getLineData(lineData);



	// Add X axis --> it is a date format
    var x = d3.scaleLinear()
      .domain(d3.extent(data, function(d) { return d.age; }))
      .range([ 0, widthLineGraph ]);


    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0.9*d3.min(data, function(d) { return +d.OverallQual; }), 1.1*d3.max(data, function(d) { return +d.OverallQual; })])
      .range([ heightLineGraph, 0 ]);
    //svg.append("g")
      //.call(d3.axisLeft(y));

	  var y1 = d3.scaleLinear()
      .domain([0.9*d3.min(data, function(d) { return +d.SalePrice; }), 1.1*d3.max(data, function(d) { return +d.SalePrice; })])
      .range([ heightLineGraph, 0 ]);

	     // x axis
            var x_axis = d3.axisBottom(x)
                ;

            // x axis
            var y_axis = d3.axisLeft(y);
			var y1_axis = d3.axisRight(y1);

	svgLineGraph.select(".x_axis")
      .transition()
	  .duration(750)
	  .attr("transform", "translate(0," + heightLineGraph + ")")
      .call(x_axis);

    svgLineGraph.select(".axisRed")
      .transition()
	  .duration(750)
	  .attr("transform", "translate(" + widthLineGraph + ",0)")
      .call(y1_axis);

	  svgLineGraph.select(".axisBlue")
      .transition()
	  .duration(750)
	  .call(y_axis);


	  //console.log("update" + data[0]['OverallQual']);

	  svgLineGraph.select(".lineO")
      .datum(data)
      .transition()
	  .duration(750)
	  .attr("fill", "none")
	  .attr("stroke", "#FF7F7F")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.age) })
        .y(function(d) { return y(d.OverallQual) })
        );

		svgLineGraph.select(".lineS")
      .datum(data)
	  .transition()
	  .duration(750)
      .attr("fill", "none")
	  .attr("stroke", "teal")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.age) })
        .y(function(d) { return y1(d.SalePrice) })
        );

	}
}

function drawLineGraph(lineData) {


	data = getLineData(lineData);
	console.log("data..",data);

	// set the dimensions and marginLineGraphs of the graph
     marginLineGraph = {top: 10, right: 30, bottom: 30, left: 60},
    widthLineGraph = 500 - marginLineGraph.left - marginLineGraph.right,
    heightLineGraph = 350 - marginLineGraph.top - marginLineGraph.bottom;

// append the svg object to the body of the page
   svgLineGraph = d3.select("#line-div")
  .append("svg")
    .attr("width", widthLineGraph + 2*marginLineGraph.left + 2*marginLineGraph.right)
    .attr("height", heightLineGraph + 2*marginLineGraph.top + 2*marginLineGraph.bottom)
  .append("g")
    .attr("transform",
          "translate(" + marginLineGraph.left + "," + marginLineGraph.top + ")");

 // Add X axis --> it is a date format
    var x = d3.scaleLinear()
      .domain(d3.extent(data, function(d) { return d.age; }))
      .range([ 0, widthLineGraph ]);

	console.log("min" +d3.min(data, function(d) { return +d.OverallQual; }));
	console.log("max" +d3.max(data, function(d) { return +d.OverallQual; }));

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0.9*d3.min(data, function(d) { return +d.OverallQual; }), 1.1*d3.max(data, function(d) { return +d.OverallQual; })])
      .range([ heightLineGraph, 0 ]);
    //svgLineGraph.append("g")
      //.call(d3.axisLeft(y));

	  var y1 = d3.scaleLinear()
      .domain([0.9*d3.min(data, function(d) { return +d.SalePrice; }), 1.1*d3.max(data, function(d) { return +d.SalePrice; })])
      .range([ heightLineGraph, 0 ]);


            // x axis
            var x_axis = d3.axisBottom(x)
                ;

            // x axis
            var y_axis = d3.axisLeft(y);
			var y1_axis = d3.axisRight(y1);

	svgLineGraph.append("g")
      .attr("class", "x_axis")
      .attr("transform", "translate(0," + heightLineGraph + ")")
      .call(x_axis);

    svgLineGraph.append("g")
	  .attr("class", "axisRed")
      .attr("transform", "translate(" + widthLineGraph + ",0)")
      .call(y1_axis);

	  svgLineGraph.append("g")
	  .attr("class", "axisBlue")
      .call(y_axis);


	  // x axis label
            svgLineGraph.append("text")
                .attr("transform", "translate(" + (widthLineGraph+marginLineGraph.left+marginLineGraph.right) + " ," + (heightLineGraph+marginLineGraph.bottom+marginLineGraph.top) + ")")
                .attr("dx", "-10.6em")
                .attr("dy", "-0.6em")
                .style("text-anchor", "end")
                .text("House Age (Year Sold - Year last remodelled)");

            // y axis label
            svgLineGraph.append("text")
                .attr("transform", "translate(" + -(marginLineGraph.left) + " ," + 0 + ")" + " rotate(-90)")
                .attr("dx", "-10.7em")
                .attr("dy", "1.0em")
                .style("text-anchor", "end")
                .text("Mean Overall Quality");

			svgLineGraph.append("text")
                .attr("transform", "translate(" + (widthLineGraph+marginLineGraph.left) + " ," + 0 + ")" + " rotate(-90)")
                .attr("dx", "-10.7em")
                .attr("dy", "1.0em")
                .style("text-anchor", "end")
                .text("Mean SalePrice");

    // Add the line
    svgLineGraph.append("path")
      .datum(data)
      .attr("fill", "none")
	  .attr("class", "lineO")
	  .attr("stroke", "#FF7F7F")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.age) })
        .y(function(d) { return y(d.OverallQual) })
        )

	svgLineGraph.append("path")
      .datum(data)
      .attr("fill", "none")
	  .attr("class", "lineS")
      .attr("stroke", "teal")
	  .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.age) })
        .y(function(d) { return y1(d.SalePrice) })
        )
}