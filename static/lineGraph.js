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

function drawLineGraph() {

// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 700 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + 2*margin.left + 2*margin.right)
    .attr("height", height + 2*margin.top + 2*margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.json("/get_line_data", function(data) {
	
          

 // Add X axis --> it is a date format
    var x = d3.scaleLinear()
      .domain(d3.extent(data, function(d) { return d.age; }))
      .range([ 0, width ]);
    

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0.9*d3.min(data, function(d) { return +d.OverallQual; }), 1.1*d3.max(data, function(d) { return +d.OverallQual; })])
      .range([ height, 0 ]);
    //svg.append("g")
      //.call(d3.axisLeft(y));
	  
	  var y1 = d3.scaleLinear()
      .domain([0.9*d3.min(data, function(d) { return +d.SalePrice; }), 1.1*d3.max(data, function(d) { return +d.SalePrice; })])
      .range([ height, 0 ]);
	  
	  
            // x axis
            var x_axis = d3.axisBottom(x)
                ;

            // x axis
            var y_axis = d3.axisLeft(y);
			var y1_axis = d3.axisRight(y1);
                
	svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(x_axis);  
	  
    svg.append("g")
	   .attr("class", "axisRed")
      .attr("transform", "translate(" + width + ",0)")
      .call(y1_axis);
	  
	  svg.append("g")
	  .attr("class", "axisBlue")
      .call(y_axis);

	  
	  // x axis label
            svg.append("text")
                .attr("transform", "translate(" + (width+margin.left+margin.right) + " ," + (height+margin.bottom+margin.top) + ")")
                .attr("dx", "-20.6em")
                .attr("dy", "-0.6em")
                .style("text-anchor", "end")
                .text("House Age (Year Sold - Year last remodelled)");

            // y axis label
            svg.append("text")
                .attr("transform", "translate(" + -(margin.left) + " ," + 0 + ")" + " rotate(-90)")
                .attr("dx", "-10.7em")
                .attr("dy", "1.0em")
                .style("text-anchor", "end")
                .text("Overall Quality");

			svg.append("text")
                .attr("transform", "translate(" + (width+margin.left) + " ," + 0 + ")" + " rotate(-90)")
                .attr("dx", "-10.7em")
                .attr("dy", "1.0em")
                .style("text-anchor", "end")
                .text("SalePrice");
	  
    // Add the line
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
	  .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.age) })
        .y(function(d) { return y(d.OverallQual) })
        )
		
	svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "red")
	  .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(function(d) { return x(d.age) })
        .y(function(d) { return y1(d.SalePrice) })
        )
});


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

            var leftMargin = 10;
            var rightMargin = 10;
            var topMargin = 20;
            var bottomMargin = 40;
            var height = 500;
            var width = 700;
            // var noOfGridlines = 10;

            // x axis scale
            var widthScale = d3.scaleBand()
                .domain(dataset.map(function(d) {
                    return d.index;
                }))
                .range([0, width - leftMargin - rightMargin])
                .padding(0.1);

            // y axis scale
            var heightScale = d3.scaleLinear()
                .domain([0, 110])
                .range([height - topMargin - bottomMargin, 0]);

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

            //		  height = height - topMargin-bottomMargin;
            //  width = width - leftMargin - rightMargin;

            // append the svg object to the body of the page
            // append a 'group' element to 'svg'
            // moves the 'group' element to the top left margin
            var container = d3.select("body")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("style", "margin-left:20em;margin-right:20em;margin-top:2em")
                //.attr("class","screeplotSvg")
                .attr("viewBox", "-50 30 " + width + " " + height);

        
            var canvas = container.append("g")
                .attr("transform", "translate(" + leftMargin + "," + topMargin + ")");


            canvas.append("g")
                .attr("transform", "translate(0," + (height - topMargin - bottomMargin) + ")")
                .call(x_axis);

            // add the y Axis
            canvas.append("g")
                .call(y_axis);


            // x axis label
            canvas.append("text")
                .attr("transform", "translate(" + (width - leftMargin - rightMargin) + " ," + (height - topMargin) + ")")
                .attr("dx", "-20.6em")
                .attr("dy", "-0.6em")
                .style("text-anchor", "end")
                .text("Number of Components");

            // y axis label
            canvas.append("text")
                .attr("transform", "translate(" + (-5 * leftMargin) + " ," + 0 + ")" + " rotate(-90)")
                .attr("dx", "-10.7em")
                .attr("dy", "1.0em")
                .style("text-anchor", "end")
                .text("Variance captured (%)");


            // add the X gridlines
            var x_gridlines = d3.axisBottom(widthScale)
                .tickSize(-height + topMargin + bottomMargin)
                .tickFormat("");


            // add the Y gridlines
            var y_gridlines = d3.axisLeft(heightScale)
                .tickSize(-width + leftMargin + rightMargin)
                .tickFormat("");

            canvas.append("g")
                .attr("class", "grid")
                .attr("transform", "translate(0," + (height - topMargin - bottomMargin) + ")")
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
                    return height - topMargin - bottomMargin - heightScale(0);
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
                    return height - topMargin - bottomMargin - heightScale(0);
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
                    return height - topMargin - bottomMargin - heightScale(0);
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
                    return height - topMargin - bottomMargin - heightScale(d.eigen);
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
                    return height - topMargin - bottomMargin - heightScale(d.eigen);
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
                    return height - topMargin - bottomMargin - heightScale(d.eigen);
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