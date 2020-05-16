var myColor = d3.scaleLinear().domain([0,10]).range(["white", "blue"]);
var diameter = 600;
var width1= 600, height1 = 500;
var bubble_global_data=[]

var svg_bubble = null;

    var pack = d3.pack()
        .size([width1, height1])
        .padding(1.5);

function getBubbleData(data){
	for (var i=0;i<data.length;i++)
	{
	    if(data[i].Neighborhood1 ==null || data[i].Neighborhood1<1){
	        continue;
	    }
		data[i] = {
					Neighborhood:   data[i].Neighborhood1,
					SalePrice:   data[i].SalePrice1
				   };
	}
	var result=[]
	var mean=[]
	groupData = groupBy(data,'Neighborhood');
    var min = Number.MAX_VALUE;
	var max = 0;

	for(i in groupData)
	{
		if(i>=0)
		{
		 sp = groupData[i].reduce((accum,item) => accum + item.SalePrice, 0)/groupData[i].length;
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
		    result.push({Name: i, Count:groupData[i].length, Scale:value});
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

console.log("data..",classes);

      var t = d3.transition()
          .duration(750);

      // hierarchy
      var h = d3.hierarchy({children: classes})
          .sum(function(d) { return d.Count; })

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
          //console.log("in circle",d);
          return d.r })
          .attr("cx", function(d){ return d.x; })
          .attr("cy", function(d){ return d.y; })

      text
        .transition(t)
          .attr("x", function(d){ return d.x; })
          .attr("y", function(d){ return d.y; });

      //ENTER
      circle.enter().append("circle")
          .attr("r", 1e-6)
          .attr("cx", function(d){
          //console.log("d...",d);
          return d.x; })
          .attr("cy", function(d){ return d.y; })
          .style("fill", "#fff")
        .transition(t)
          .style("fill", function(d) {
         return myColor(d.data.Scale*10);
            })
          .attr("r", function(d){ return d.r });

      text.enter().append("text")
         //.attr("opacity", 1e-1)
          .attr("x", function(d){ return d.x; })
          .attr("y", function(d){ return d.y; })
          .text(function(d){ return d.data.Name; })
        .transition(t)
          .attr("opacity", 1);

}

}