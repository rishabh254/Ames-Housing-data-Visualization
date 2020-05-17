function getMax(arr, prop) {
    var max;
    for (var i = 0; i < arr.length; i++) {
        if (max == null || parseInt(arr[i][prop]) > parseInt(max))
            max = arr[i][prop];
    }
    return max;
}

function getMin(arr, prop) {
    var min;
    for (var i = 0; i < arr.length; i++) {
        if (min == null || parseInt(arr[i][prop]) < parseInt(min))
            min = arr[i][prop];
    }
    return min;
}

d_mds_orig = [];
features = ['OverallQual1','SalePrice1']

function drawMDSscatter(type) {
	
	
    d3.json("/get_mds/" + type,
        function(d) {

            d_mds_orig = (JSON.parse(d.mds_orig));
            //d_mds_random = (JSON.parse(d.mds_random));
            //d_mds_stratified = (JSON.parse(d.mds_stratified));
			console.log("hello "+(d_mds_orig.length))

            var leftMargin = 10;
            var rightMargin = 10;
            var topMargin = 40;
            var bottomMargin = 40;
            var height = 600;
            var width = 600;

            // x axis scale
            var widthScale = d3.scaleLinear()
                .domain([Math.round(getMin(d_mds_orig, "dim0"))-0.3, Math.round(getMax(d_mds_orig, "dim0"))+0.3])
                .range([0, width - leftMargin - rightMargin]);

            if (type == 'correlation')
                widthScale.domain([-1.5, 1.5]);

            // y axis scale
            var heightScale = d3.scaleLinear()
                .domain([Math.round(getMin(d_mds_orig, "dim1"))-0.3 , Math.round(getMax(d_mds_orig, "dim1"))+0.3])
                .range([height - topMargin - bottomMargin, 0]);

            if (type == 'correlation')
                heightScale.domain([-1.5, 1.5]);

            var colorScale = ["teal", "#FF7F7F"];
			var borderScale = ["black", "black"];

            // color scale
            var color = d3.scaleLinear()
                .domain([0, 100])
                .range(["red", "blue"]);

            // x axis
            var x_axis = d3.axisBottom(widthScale)
                .ticks(10)
                .tickSize(10);

            // x axis
            var y_axis = d3.axisLeft(heightScale)
                .ticks(10)
                .tickSize(10);

            // container for svg graph
            var container = d3.select("#dcm-div")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("style", "margin-left:0em;margin-right:5em;margin-top:0em")
                //.attr("class","screeplotSvg")
                .attr("viewBox", "-50 0 " + width + " " + height);


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
                .attr("transform", "translate(" + (width +leftMargin +rightMargin) + " ," + (height - topMargin) + ")")
                .attr("dx", "-25.6em")
                .attr("dy", "-0.6em")
                .style("text-anchor", "end")
                .text("Dimension 1");

            // y axis label
            canvas.append("text")
                .attr("transform", "translate(" + (-5 * leftMargin) + " ," + -90 + ")" + " rotate(-90)")
                .attr("dx", "-15.7em")
                .attr("dy", "1.0em")
                .style("text-anchor", "end")
                .text("Dimension 2");
				
			// Define the div for the tooltip
			var div = d3.select("body").append("div")	
				.attr("class", "tooltip")
				.style("opacity", 0);

            canvas.append('g')
                .selectAll("dot")
                .data(d_mds_orig)
                .enter()
                .append("circle")
                .attr("id", function(d,i) {
                    return "scatter_"+i;
                })
				.attr("class","scatter_o")
                .attr("cx", function(d) {
                    return widthScale(d["dim0"]);
                })
                .attr("cy", function(d) {
                    return heightScale(d["dim1"]);
                })
				.attr("r", function(d) {
                    return 4*(d["dataType"]+1);
                })
                .attr("opacity", "1")
				.style("stroke", function(d) {
                    return borderScale[d["dataType"]];
                })
                .style("fill", function(d) {
                    return myColor1[d["dataType"]](d['GarageArea']*10);
                })
				.on("mouseover", function(d) {
					
					d3.select(this).transition()
                .duration('300')
                .attr("r",10);
						
					div.transition()		
						.duration(200)		
						.style("opacity", .9);		
					div.html("OverallQual : " + d["OverallQual1"] + "\nSalePrice : "+d["SalePrice1"] )	
						.style("left", (width/2+leftMargin + rightMargin + widthScale(d["dim0"])) + "px")		
						.style("top", (height/4 + heightScale(d["dim1"])) + "px");	
					})					
				.on("mouseout", function(d) {		
					
					d3.select(this).transition()
                .duration('300')
                .attr("r", function(d) {
                    return 4*(d["dataType"]+1);
                });
					
					div.transition()		
						.duration(500)		
						.style("opacity", 0);	
				});
				
				canvas.append('g')
                .selectAll("dot")
                .data(d_mds_orig)
                .enter()
                .append("text")
                .attr("class", "scatter_o")
                .attr("x", function(d) {
                    return widthScale(d["dim0"])-30;
                })
                .attr("y", function(d) {
                    return heightScale(d["dim1"])-10;
                })
				.text(function(d) {
                    return d["label"];
                })
                .attr("opacity", "1")
				;

			
			//for(var i=0;i<d_mds_orig.length;i++)
			//{
//				canvas.selectAll(".scatter_o")
//                .transition()
//                .duration(50)
//                .delay(function(d, i) {
//                    return (i)
//                });
        });
}