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
	console.log("dataupdate.",data);


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

	svgLineGraph.select(".axisWhite")
      .transition()
	  .duration(750)
	  .attr("transform", "translate(0," + heightLineGraph + ")")
      .call(x_axis);

    svgLineGraph.select(".axisTeal")
      .transition()
	  .duration(750)
	  .attr("transform", "translate(" + widthLineGraph + ",0)")
      .call(y1_axis);

	  svgLineGraph.select(".axisPink")
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
	  .attr("stroke", "#6EC6BA")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.age) })
        .y(function(d) { return y1(d.SalePrice) })
        );
		
		var focusS = svgLineGraph.select(".focusS")
            .style("display", "none");
			
		var focusO = svgLineGraph.select(".focusO")
            .style("display", "none");

        

        focusS.select(".tooltip")
            .attr("width", 100)
            .attr("height", 50)
            .attr("x", 10)
            .attr("y", -22)
            .attr("rx", 4)
            .attr("ry", 4);	

		focusO.select(".tooltip")
            .attr("width", 100)
            .attr("height", 50)
            .attr("x", 10)
            .attr("y", -22)
            .attr("rx", 4)
            .attr("ry", 4);	

 /*       focusS.select(".tooltip-likesS")
			.datum(data)
            .attr("x", function(d) { return x(d.age) })
            .attr("y", function(d) { return y1(d.SalePrice) });
			
		  focusO.select(".tooltip-likesO")
			.datum(data)
            .attr("x", function(d) { return x(d.age) })
            .attr("y", function(d) { return y(d.OverallQual) });
	*/		
		 svgLineGraph.select(".overlay")
            .attr("width", width)
            .attr("height", height)
            .on("mouseover", function() { focusS.style("display", null); focusO.style("display", null); })
            .on("mouseout", function() { focusS.style("display", "none"); focusO.style("display", "none"); })
            .on("mousemove", mousemove);
			
			var bisectDate = d3.bisector(function(d) { return d.age; }).left;
			
		
			
        function mousemove() {
            var x0 = x.invert(d3.mouse(this)[0]),
                i = bisectDate(data, x0, 1),
                d0 = data[i - 1],
                d1 = data[i],
                d = x0 - d0.age > d1.age - x0 ? d1 : d0;
				
           focusS.attr("transform", "translate(" + x(d.age) + "," + y1(d.SalePrice) + ")");
			focusO.attr("transform", "translate(" + x(d.age) + "," + y(d.OverallQual) + ")");
			
            focusS.select(".tooltip-likesS").html((d.SalePrice/1000).toFixed(2)+"k")
			.attr("fill", "#6EC6BA");
			
			focusO.select(".tooltip-likesO").html((d.OverallQual).toFixed(2)).attr("fill", "#FF7F7F");
        }

	}
}

function drawLineGraph(lineData) {


	data = getLineData(lineData);
	console.log("data..",data);

	// set the dimensions and marginLineGraphs of the graph
     marginLineGraph = {top: 10, right: 30, bottom: 30, left: 60},
    widthLineGraph = 400 - marginLineGraph.left - marginLineGraph.right,
    heightLineGraph = 200 - marginLineGraph.top - marginLineGraph.bottom;

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
      .attr("class", "axisWhite")
      .attr("transform", "translate(0," + heightLineGraph + ")")
      .call(x_axis);

    svgLineGraph.append("g")
	  .attr("class", "axisTeal")
      .attr("transform", "translate(" + widthLineGraph + ",0)")
      .call(y1_axis);

	  svgLineGraph.append("g")
	  .attr("class", "axisPink")
      .call(y_axis);


	  // x axis label
            svgLineGraph.append("text")
                .attr("transform", "translate(" + (widthLineGraph+2*marginLineGraph.left+marginLineGraph.right) + " ," + (heightLineGraph+marginLineGraph.bottom+marginLineGraph.top) + ")")
				.attr("fill", textColor)
                .attr("dx", "-10.6em")
                .attr("dy", "-0.6em")
                .style("text-anchor", "end")
                .text("House Age (Year Sold - Year last remodelled)");

            // y axis label
            svgLineGraph.append("text")
                .attr("transform", "translate(" + -(0.8*marginLineGraph.left) + " ," +(-4*marginLineGraph.bottom) + ")" + " rotate(-90)")
                .attr("fill", "#FF7F7F")
				.attr("dx", "-10.7em")
                .attr("dy", "1.0em")
                .style("text-anchor", "end")
                .text("Mean Overall Quality");

			svgLineGraph.append("text")
                .attr("transform", "translate(" + (widthLineGraph+1.3*marginLineGraph.left) + " ," +(heightLineGraph+4*marginLineGraph.bottom) + ")" + " rotate(90)")
                .attr("fill", "#6EC6BA")
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
		
	var focusS = svgLineGraph.append("g")
            .attr("class", "focusS")
            .style("display", "none");
			
	var focusO = svgLineGraph.append("g")
            .attr("class", "focusO")
            .style("display", "none");

        focusS.append("circle")
            .attr("r", 5);
			
		focusO.append("circle")
            .attr("r", 5);

        focusS.append("rect")
            .attr("class", "tooltip")
            .attr("width", 100)
            .attr("height", 50)
            .attr("x", 10)
            .attr("y", -22)
            .attr("rx", 4)
            .attr("ry", 4);	

		focusO.append("rect")
            .attr("class", "tooltip")
            .attr("width", 100)
            .attr("height", 50)
            .attr("x", 10)
            .attr("y", -22)
            .attr("rx", 4)
            .attr("ry", 4);	

        focusS.append("text")
		//	.datum(data)
            .attr("class", "tooltip-likesS")
        //    .attr("x", function(d) { return x(d.age) })
          //  .attr("y", function(d) { return y1(d.SalePrice) });
		  ;
			
		  focusO.append("text")
          //  .datum(data)
			.attr("class", "tooltip-likesO")
        //    .attr("x", function(d) { return x(d.age) })
          //  .attr("y", function(d) { return y(d.OverallQual) })
		  ;
			
		 svgLineGraph.append("rect")
            .attr("class", "overlay")
            .attr("width", width)
            .attr("height", height)
            .on("mouseover", function() { focusS.style("display", null); focusO.style("display", null); })
            .on("mouseout", function() { focusS.style("display", "none"); focusO.style("display", "none"); })
            .on("mousemove", mousemove);
			
			var bisectDate = d3.bisector(function(d) { return d.age; }).left;
			
		
			
        function mousemove() {
            var x0 = x.invert(d3.mouse(this)[0]);
            var i = bisectDate(data, x0, 1);
            var d0 = (i>0) ? data[i - 1] : 0;
            var d1 = data[i];
            var d = x0 - d0.age > d1.age - x0 ? d1 : d0;
				
           focusS.attr("transform", "translate(" + x(d.age) + "," + y1(d.SalePrice) + ")");
			focusO.attr("transform", "translate(" + x(d.age) + "," + y(d.OverallQual) + ")");
			
            focusS.select(".tooltip-likesS").html((d.SalePrice/1000).toFixed(2)+"k")
			.attr("fill", "#6EC6BA");
			
			focusO.select(".tooltip-likesO").html((d.OverallQual).toFixed(2)).attr("fill", "#FF7F7F");
        }
		
	
		

	svgLineGraph.append("path")
      .datum(data)
      .attr("fill", "none")
	  .attr("class", "lineS")
      .attr("stroke", "#6EC6BA")
	  .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.age) })
        .y(function(d) { return y1(d.SalePrice) })
        )
}