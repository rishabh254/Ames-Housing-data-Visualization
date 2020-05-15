/*function updateOrig_scree() {
    if (d3.select("#myCheckboxOrig").property("checked")) {
        updateScree(0, visibility[1]);

    } else {
        updateScree(0, visibility[0]);
    }
}

function updateRand_scree() {
    if (d3.select("#myCheckboxRand").property("checked")) {
        updateScree(1, visibility[1]);

    } else {
        updateScree(1, visibility[0]);
    }
}

function updateStrat_scree() {
    if (d3.select("#myCheckboxStrat").property("checked")) {
        updateScree(2, visibility[1]);

    } else {
        updateScree(2, visibility[0]);
    }
}




function updateScree(dataType, visibility) {
    switch (dataType) {
        case 0:
            d3.select("body").selectAll(".cumulative_o").style("visibility", visibility);
            d3.select("body").selectAll(".dotScreePlot_o").style("visibility", visibility);
            break;
        case 1:
            d3.select("body").selectAll(".cumulative_r").style("visibility", visibility);
            d3.select("body").selectAll(".dotScreePlot_r").style("visibility", visibility);
            break;
        case 2:
            d3.select("body").selectAll(".cumulative_s").style("visibility", visibility);
            d3.select("body").selectAll(".dotScreePlot_s").style("visibility", visibility);
            break;
    }
}*/

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
	  .attr("stroke", "steelblue")
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
	  .attr("stroke", "red")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.age) })
        .y(function(d) { return y1(d.SalePrice) })
        );
	  
	}
}

function drawLineGraph(lineData) {

	
	data = getLineData(lineData);
	
	// set the dimensions and marginLineGraphs of the graph
     marginLineGraph = {top: 10, right: 30, bottom: 30, left: 60},
    widthLineGraph = 700 - marginLineGraph.left - marginLineGraph.right,
    heightLineGraph = 500 - marginLineGraph.top - marginLineGraph.bottom;

// append the svg object to the body of the page
   svgLineGraph = d3.select("#my_dataviz")
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
                .attr("dx", "-20.6em")
                .attr("dy", "-0.6em")
                .style("text-anchor", "end")
                .text("House Age (Year Sold - Year last remodelled)");

            // y axis label
            svgLineGraph.append("text")
                .attr("transform", "translate(" + -(marginLineGraph.left) + " ," + 0 + ")" + " rotate(-90)")
                .attr("dx", "-10.7em")
                .attr("dy", "1.0em")
                .style("text-anchor", "end")
                .text("Overall Quality");

			svgLineGraph.append("text")
                .attr("transform", "translate(" + (widthLineGraph+marginLineGraph.left) + " ," + 0 + ")" + " rotate(-90)")
                .attr("dx", "-10.7em")
                .attr("dy", "1.0em")
                .style("text-anchor", "end")
                .text("SalePrice");
	  
    // Add the line
	console.log("original" + data[0]);
    svgLineGraph.append("path")
      .datum(data)
      .attr("fill", "none")
	  .attr("class", "lineO")
	  .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.age) })
        .y(function(d) { return y(d.OverallQual) })
        )
		
	svgLineGraph.append("path")
      .datum(data)
      .attr("fill", "none")
	  .attr("class", "lineS")
      .attr("stroke", "red")
	  .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.age) })
        .y(function(d) { return y1(d.SalePrice) })
        )



    /*d3.json("/get_eigen",
        function(d) {
            screePlotData = d.eigen_orig;
            console.log(d.eigen_orig);

            df_orig = d.eigen_orig;
            df_random = d.eigen_random;
            df_stratified = d.eigen_stratified;
            //document.getElementById("d3-write-here").innerHTML = d;

            console.log(df_orig);
            df_orig.push({
                cum_eigen: 100,
                eigen: 0,
                index: 13
            });
            df_random.push({
                cum_eigen: 100,
                eigen: 0,
                index: 13
            });
            df_stratified.push({
                cum_eigen: 100,
                eigen: 0,
                index: 13
            });



            var dataset = screePlotData;

            // format the data
            dataset.forEach(function(d) {
                d.eigen = +d.eigen;
            });

            var leftmarginLineGraph = 10;
            var rightmarginLineGraph = 10;
            var topmarginLineGraph = 20;
            var bottommarginLineGraph = 40;
            var height = 500;
            var width = 700;
            // var noOfGridlines = 10;

            // x axis scale
            var widthScale = d3.scaleBand()
                .domain(dataset.map(function(d) {
                    return d.index;
                }))
                .range([0, width - leftmarginLineGraph - rightmarginLineGraph])
                .padding(0.1);

            // y axis scale
            var heightScale = d3.scaleLinear()
                .domain([0, 110])
                .range([height - topmarginLineGraph - bottommarginLineGraph, 0]);

            //var color = d3.scaleOrdinal(d3.schemeCategory20c);
            // color scale
            var color = d3.scaleLinear()
                .domain([0, 100])
                .range(["red", "blue"]);

            // x axis
            var x_axis = d3.axisBottom(widthScale)
                .ticks(screePlotData.length)
                .tickFormat(function(n, i) {
                    return i + 1;
                });

            // x axis
            var y_axis = d3.axisLeft(heightScale)
                .ticks(10)
                .tickSize(10);

            //		  height = height - topmarginLineGraph-bottommarginLineGraph;
            //  width = width - leftmarginLineGraph - rightmarginLineGraph;

            // append the svg object to the body of the page
            // append a 'group' element to 'svg'
            // moves the 'group' element to the top left marginLineGraph
            var container = d3.select("body")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("style", "marginLineGraph-left:20em;marginLineGraph-right:20em;marginLineGraph-top:2em")
                //.attr("class","screeplotSvg")
                .attr("viewBox", "-50 30 " + width + " " + height);

        
            var canvas = container.append("g")
                .attr("transform", "translate(" + leftmarginLineGraph + "," + topmarginLineGraph + ")");


            canvas.append("g")
                .attr("transform", "translate(0," + (height - topmarginLineGraph - bottommarginLineGraph) + ")")
                .call(x_axis);

            // add the y Axis
            canvas.append("g")
                .call(y_axis);


            // x axis label
            canvas.append("text")
                .attr("transform", "translate(" + (width - leftmarginLineGraph - rightmarginLineGraph) + " ," + (height - topmarginLineGraph) + ")")
                .attr("dx", "-20.6em")
                .attr("dy", "-0.6em")
                .style("text-anchor", "end")
                .text("Number of Components");

            // y axis label
            canvas.append("text")
                .attr("transform", "translate(" + (-5 * leftmarginLineGraph) + " ," + 0 + ")" + " rotate(-90)")
                .attr("dx", "-10.7em")
                .attr("dy", "1.0em")
                .style("text-anchor", "end")
                .text("Variance captured (%)");


            // add the X gridlines
            var x_gridlines = d3.axisBottom(widthScale)
                .tickSize(-height + topmarginLineGraph + bottommarginLineGraph)
                .tickFormat("");


            // add the Y gridlines
            var y_gridlines = d3.axisLeft(heightScale)
                .tickSize(-width + leftmarginLineGraph + rightmarginLineGraph)
                .tickFormat("");

            canvas.append("g")
                .attr("class", "grid")
                .attr("transform", "translate(0," + (height - topmarginLineGraph - bottommarginLineGraph) + ")")
                .call(x_gridlines);


            canvas.append("g")
                .attr("class", "grid")
                .call(y_gridlines);



            // append the rectangles for the bar chart
            // group of bars
            var barGroups_orig = canvas.selectAll(".bar")
                .data(df_orig, function(d) {
                    return d.index
                });

            var barGroups_random = canvas.selectAll(".bar")
                .data(df_random, function(d) {
                    return d.index
                });

            var barGroups_stratified = canvas.selectAll(".bar")
                .data(df_stratified, function(d) {
                    return d.index
                });

         

            // individual bars
            var bars_orig = barGroups_orig
                .enter()
                .append("rect")
                .attr("class", "bar_o")
                .attr("height", function(d) {
                    return height - topmarginLineGraph - bottommarginLineGraph - heightScale(0);
                })
                .attr("width", widthScale.bandwidth() / 4)
                .attr("fill", function(d) {
                    return d3.rgb(42, 77, 105);
                })
                .attr("x", function(d) {
                    //return i * (width / dataArray.length) - 1.5 * dataArray.length;
                    return widthScale(d.index) + 0.5 * widthScale.bandwidth() / 4;
                })
                .attr("y", function(d) {
                    return heightScale(0);
                });


            var bars_random = barGroups_random
                .enter()
                .append("rect")
                .attr("class", "bar_r")
                .attr("height", function(d) {
                    return height - topmarginLineGraph - bottommarginLineGraph - heightScale(0);
                })
                .attr("width", widthScale.bandwidth() / 4)
                .attr("fill", function(d) {
                    return d3.rgb(238, 98, 98);
                })
                .attr("x", function(d) {
                    //return i * (width / dataArray.length) - 1.5 * dataArray.length;
                    return widthScale(d.index) + 1.5 * widthScale.bandwidth() / 4;
                })
                .attr("y", function(d) {
                    return heightScale(0);
                });

            var bars_stratified = barGroups_stratified
                .enter()
                .append("rect")
                .attr("class", "bar_s")
                .attr("height", function(d) {
                    return height - topmarginLineGraph - bottommarginLineGraph - heightScale(0);
                })
                .attr("width", widthScale.bandwidth() / 4)
                .attr("fill", function(d) {
                    return d3.rgb(153, 184, 152);
                })
                .attr("x", function(d) {
                    //return i * (width / dataArray.length) - 1.5 * dataArray.length;
                    return widthScale(d.index) + 2.5 * widthScale.bandwidth() / 4;
                })
                .attr("y", function(d) {
                    return heightScale(0);
                });

            canvas.selectAll(".bar_o")
                .transition()
                .duration(800)
                .attr("y", function(d) {
                    return heightScale(d.eigen);
                })
                .attr("height", function(d) {
                    return height - topmarginLineGraph - bottommarginLineGraph - heightScale(d.eigen);
                })
                .delay(function(d, i) {
                    return (i * 100)
                });

            canvas.selectAll(".bar_r")
                .transition()
                .duration(800)
                .attr("y", function(d) {
                    return heightScale(d.eigen);
                })
                .attr("height", function(d) {
                    return height - topmarginLineGraph - bottommarginLineGraph - heightScale(d.eigen);
                })
                .delay(function(d, i) {
                    return (i * 100)
                });

            canvas.selectAll(".bar_s")
                .transition()
                .duration(800)
                .attr("y", function(d) {
                    return heightScale(d.eigen);
                })
                .attr("height", function(d) {
                    return height - topmarginLineGraph - bottommarginLineGraph - heightScale(d.eigen);
                })
                .delay(function(d, i) {
                    return (i * 100)
                });
            //bars.exit().remove();

            // define the line
            var valueline_orig = d3.line()
                .x(function(d) {
                    return widthScale(d.index) + 4 * widthScale.bandwidth() / 8;
                })
                .y(function(d) {
                    return heightScale(d.cum_eigen);
                });

            var valueline_random = d3.line()
                .x(function(d) {
                    return widthScale(d.index) + 4 * widthScale.bandwidth() / 8;
                })
                .y(function(d) {
                    return heightScale(d.cum_eigen);
                });

            var valueline_stratified = d3.line()
                .x(function(d) {
                    return widthScale(d.index) + 4 * widthScale.bandwidth() / 8;
                })
                .y(function(d) {
                    return heightScale(d.cum_eigen);
                });



            var lineSegments = canvas.selectAll(".cumulative");
            // Add the valueline path as multiple smaller segments
            d3.selectAll(".cumulative").remove();
            for (var i = 0; i < df_orig.length - 1; i++) {

                var line_orig = lineSegments.data([df_orig.slice(i, i + 2)], function(d) {
                        return d.index;
                    })
                    .enter().append("path")
                    .attr("class", "cumulative_o")
                    .attr("d", valueline_orig)
                    .attr("stroke", function(d) {
                        return d3.rgb(42, 77, 105);
                    })
                    .attr("stroke-width", function(d) {
                        return 2;
                    });
            }

            for (var i = 0; i < df_random.length - 1; i++) {

                var line_random = lineSegments.data([df_random.slice(i, i + 2)], function(d) {
                        return d.index;
                    })
                    .enter().append("path")
                    .attr("class", "cumulative_r")
                    .attr("d", valueline_random)
                    .attr("stroke", function(d) {
                        return d3.rgb(238, 98, 98);
                    })
                    .attr("stroke-width", function(d) {
                        return 2;
                    });
            }

            for (var i = 0; i < df_stratified.length - 1; i++) {

                var line_stratified = lineSegments.data([df_stratified.slice(i, i + 2)], function(d) {
                        return d.index;
                    })
                    .enter().append("path")
                    .attr("class", "cumulative_s")
                    .attr("d", valueline_stratified)
                    .attr("stroke", function(d) {
                        return d3.rgb(153, 184, 152);
                    })
                    .attr("stroke-width", function(d) {
                        return 2;
                    });
            }


            // Add the scatterplot
            var scatterPoints_orig = canvas.selectAll(".dotScreePlot")
                .data(df_orig);

            var scatterPoints_random = canvas.selectAll(".dotScreePlot")
                .data(df_random);

            var scatterPoints_stratified = canvas.selectAll(".dotScreePlot")
                .data(df_stratified)

            ;

            var scatterPoint_orig = scatterPoints_orig.enter().append("circle")
                .attr("class", "dotScreePlot_o")
                .attr("r", function(d) {
                    if (d.index == 3) return widthScale.bandwidth() / 4;
                    else return widthScale.bandwidth() / 12;
                })
                .attr("fill", d3.rgb(42, 77, 105))
                .attr("cx", function(d) {
                    return widthScale(d.index) + 4 * widthScale.bandwidth() / 8;
                })
                .attr("cy", function(d) {
                    return heightScale(d.cum_eigen);
                });

            var scatterPoint_random = scatterPoints_random.enter().append("circle")
                .attr("class", "dotScreePlot_r")
                .attr("r", function(d) {
                    if (d.index == 3) return widthScale.bandwidth() / 4;
                    else return widthScale.bandwidth() / 12;
                })
                .attr("fill", d3.rgb(238, 98, 98))
                .attr("cx", function(d) {
                    return widthScale(d.index) + 4 * widthScale.bandwidth() / 8;
                })
                .attr("cy", function(d) {
                    return heightScale(d.cum_eigen);
                });

            var scatterPoint_stratified = scatterPoints_stratified.enter().append("circle")
                .attr("r", function(d) {
                    if (d.index == 3) return widthScale.bandwidth() / 4;
                    else return widthScale.bandwidth() / 12;
                })
                .attr("class", "dotScreePlot_s")
                .attr("fill", d3.rgb(153, 184, 152))
                .attr("cx", function(d) {
                    return widthScale(d.index) + 4 * widthScale.bandwidth() / 8;
                })
                .attr("cy", function(d) {
                    return heightScale(d.cum_eigen);
                });


        });*/

}