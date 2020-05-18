var myColor1= [d3.scaleLinear().domain([0,10]).range(["white","teal"]), d3.scaleLinear().domain([0,10]).range(["#FF7F7F", "#FF7F7F"])];

var myColor = d3.scaleLinear().domain([0,10]).range(["white","teal"]);
var diameter = 600;
var width1= 420, height1 = 250;
var bubble_global_data=[]

var svg_bubble = null;

    var pack = d3.pack()
        .size([width1, height1])
        .padding(1.5);


function getItemScore(item){
    var score=0;
    if(scoreFeatures.length==0)
        score = 0;
    else{
			score = 0;
				for(var j=0;j<scoreFeatures.length;j++)
				{
				    if(scoreFeatures[j]=="SalePrice"){
				        score += (1- item[scoreFeatures[j]])/scoreFeatures.length;
				    } else{
				        score += item[scoreFeatures[j]]/scoreFeatures.length;
				    }
				}
			}
	return score;
}

function getBubbleData(data){
	for (var i=0;i<data.length;i++)
	{
	    if(data[i].Neighborhood1 ==null || data[i].Neighborhood1<1){
	        continue;
	    }
		data[i] = {
					NeighborhoodLabel:   data[i].Neighborhood1,
					NeighborhoodText : data[i].NeighborhoodText,
					SalePrice:   data[i].SalePrice,
					OverallQual:   data[i].OverallQual,
					GarageArea: data[i].GarageArea,
					GrLivArea: data[i].GrLivArea,
					LotArea: data[i].LotArea,
					KitchenQual: data[i].KitchenQual,
					YrSold: data[i].YrSold,
					SalePrice1:   data[i].SalePrice1,
					OverallQual1:   data[i].OverallQual1,
				   };
	}
	var result=[]
	var mean=[]
	groupData = groupBy(data,'NeighborhoodLabel');
    var min = Number.MAX_VALUE;
	var max = 0;

	for(i in groupData)
	{
		if(i>=0)
		{
		 sp = groupData[i].reduce((accum,item) => accum + getItemScore(item), 0)/groupData[i].length;
		 mean[i] = sp;
		 if(sp > max){
		    max = sp;
		 }
		 if(sp<min){
		    min = sp;
		 }
		}
	}

	for(i in mean)
	{
		if(i>=0 &&  !isNaN(mean[i]))
		{
		    value = mean[i];
		    if(max!= min){
		        value = (mean[i] - min) / (max - min);
		    }
		    meanSalePrice = groupData[i].reduce((accum,item) => accum + item.SalePrice1, 0)/groupData[i].length;
		    meanOverallQual = groupData[i].reduce((accum,item) => accum + item.OverallQual1, 0)/groupData[i].length;

		    result.push({Name: groupData[i][0]['NeighborhoodText'], Count:groupData[i].length, Scale:value, MeanSalePrice:meanSalePrice,
		     MeanOverallQual:meanOverallQual});
		}
	}
	return result;
}




function bubble_test(){
    d3.json("/get_mds/euclidean", function(data) {
        bubble_global_data = JSON.parse(data.mds_orig);
        data = getBubbleData(bubble_global_data.slice());
        drawBubbleGraph(data);
    });
}

function updateBubbleGraph(data){
    drawBubbleGraphUtil(data);
}

function drawBubbleGraph(data){
    svg_bubble = d3.select("#bubble-div").append("svg").attr("width", width1).attr("height", height1);
    drawBubbleGraphUtil(data);
}

function drawBubbleGraphUtil(classes) {
if(svg_bubble != null){
      var t = d3.transition()
          .duration(100);

      // hierarchy
      var h = d3.hierarchy({children: classes})
          .sum(function(d) { return d.Count; });

      //JOIN
      var circle = svg_bubble.selectAll("circle")
          .data(pack(h).leaves(), function(d){ return d.data.Name; });



      var text = svg_bubble.selectAll("text")
          .data(pack(h).leaves(), function(d){ return d.data.Name; });

      //EXIT
      circle.exit().style("fill", function(d) {
         return myColor(d.data.Scale*10);
            })
        .transition(t)
          .attr("r", 1e-6)
          .remove();

      text.exit()
        .transition(t)
          .attr("opacity", 1e-6)
          .remove();

      //UPDATE
      circle
        .transition(t)
          .style("fill", function(d) {
         return myColor(d.data.Scale*10);
            })
          .attr("r", function(d){
          return d.r })
          .attr("cx", function(d){ return d.x; })
          .attr("cy", function(d){ return d.y; })

      text
        .transition(t)
          .attr("x", function(d){ return d.x-20; })
		  .attr("font-size", function(d){ return d.r/2+"px";})
          .attr("y", function(d){ return d.y; });

      //ENTER
      circle.enter().append("circle")
          .attr("r", 1e-6)
          .attr("cx", function(d){
          return d.x; })
          .attr("cy", function(d){ return d.y; })
          .style("fill", "#fff").
          on("mouseover", function(d) {
				tooltip.transition()
				.duration(200)
				.style("opacity", .9);
				tooltip.html(d.data.Name +  "<br>No of Houses : "+ d.data.Count +"<br>Mean OverallQual : " + d.data.MeanOverallQual.toFixed(2) + "<br>Mean SalePrice : "
				+(d.data.MeanSalePrice/1000).toFixed(2)+"k").style("top", (event.pageY)+"px").
				style("left",(event.pageX)+"px")
		}).
		on("mouseout", function(d) {
		    tooltip.transition()
			.duration(500)
			.style("opacity", 0);
			})
        .transition(t)
          .style("fill", function(d) {
         return myColor(d.data.Scale*10);
            })
          .attr("r", function(d){ return d.r});

      text.enter().append("text")
         //.attr("opacity", 1e-1)
		 .attr("fill", "black")
          .attr("x", function(d){ return d.x-20; })
          .attr("y", function(d){ return d.y; })
          .attr("font-family", "sans-serif")
          .attr("font-size", function(d){ return d.r/2+"px";})
		  //.attr("font-size", "7px")
          .text(function(d){ return d.data.Name; }).on("mouseover", function(d) {
				tooltip.transition()
				.duration(200)
				.style("opacity", .9);
				tooltip.html(d.data.Name +  "<br>No of Houses : "+ d.data.Count +"<br>Mean OverallQual : " + d.data.MeanOverallQual.toFixed(2) + "<br>Mean SalePrice : "
				+(d.data.MeanSalePrice/1000).toFixed(2)+"k").style("top", (event.pageY)+"px").
				style("left",(event.pageX)+"px")
		}).
		on("mouseout", function(d) {
		    tooltip.transition()
			.duration(500)
			.style("opacity", 0);
			})
        .transition(t)
          .attr("opacity", 1);


     var tooltip = d3.select("body")
    .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip");

}

}