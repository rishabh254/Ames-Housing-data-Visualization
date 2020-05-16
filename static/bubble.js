//var bubble_global_data ={};
//var diameter = 600;
//var svg_bubble =null;
//
//var myColor = d3.scaleLinear().domain([0,10]).range(["white", "blue"])
//
//
//
//function getBubbleData(data){
//	for (var i=0;i<data.length;i++)
//	{
//	    if(data[i].Neighborhood1 ==null || data[i].Neighborhood1<1){
//	        continue;
//	    }
//		data[i] = {
//					Neighborhood:   data[i].Neighborhood1,
//					SalePrice:   data[i].SalePrice1
//				   };
//	}
//	var result=[]
//	var mean=[]
//	groupData = groupBy(data,'Neighborhood');
//    var min = Number.MAX_VALUE;
//	var max = 0;
//
//	for(i in groupData)
//	{
//		if(i>=0)
//		{
//		 sp = groupData[i].reduce((accum,item) => accum + item.SalePrice, 0)/groupData[i].length;
//		 mean[i] = sp;
//		 if(sp > max){
//		    max = sp;
//		 }
//		 if(sp<min){
//		    min = sp;
//		 }
//		}
//	}
//
//	for(i in mean)
//	{
//		if(i>=0 &&  !isNaN(mean[i]))
//		{
//		    value = mean[i];
//		    if(max!= min){
//		        value = (mean[i] - min) / (max - min);
//		    }
//		    result.push({Name: i, Count:groupData[i].length, Scale:value});
//		}
//	}
//	return result;
//}
//
//
//function bubble_test(){
//    d3.json("/get_mds/euclidean", function(data) {
//        bubble_global_data = JSON.parse(data.mds_orig);
//        drawBubbleGraph(bubble_global_data.slice());
//    });
//}
//
//function drawBubbleGraph(bubbleData) {
//    data = getBubbleData(bubbleData);
//    var dataset ={};
//    dataset["children"] = data;
////    console.log("dataset...",dataset);
//
//    svg_bubble =  d3.select("#my_dataviz")
//            .append("svg")
//            .attr("width", diameter)
//            .attr("height", diameter)
//            .attr("class", "bubble");
//
//    var bubble = d3.pack(dataset)
//            .size([diameter, diameter])
//            .padding(1.5);
//
//            var nodes = d3.hierarchy(dataset)
//            .sum(function(d) {
//            return d.Count; });
//
//        var node = svg_bubble.selectAll(".node")
//            .data(bubble(nodes).descendants())
//            .enter()
//            .filter(function(d){
//                return  !d.children
//            })
//            .append("g")
//            .attr("class", "node")
//            .attr("transform", function(d) {
//                return "translate(" + d.x + "," + d.y + ")";
//            });
//
//
//        node.append("title").attr("class", "bubble-title")
//            .text(function(d) {
//                return d.Name + ": " + Math.round(d.Count);
//            });
//
//        node.append("circle").attr("class", "bubble-circle")
//            .attr("r", function(d) {
//
//                return d.r;
//            })
//            .style("fill", function(d) {
//                return myColor(d.data.Scale*10);
//            });
//
//        node.append("text")
//            .attr("dy", ".2em").attr("class", "node-text-name")
//            .style("text-anchor", "middle")
//            .text(function(d) {
//                return d.data.Name;
//            })
//            .attr("font-family", "sans-serif")
//            .attr("font-size", function(d){
//                return d.r/5;
//            })
//            .attr("fill", "white");
//
//        node.append("text")
//            .attr("dy", "1.3em").attr("class", "node-text-count")
//            .style("text-anchor", "middle")
//            .text(function(d) {
//                return d.data.Count;
//            })
//            .attr("font-family",  "Gill Sans", "Gill Sans MT")
//            .attr("font-size", function(d){
//                return d.r/5;
//            })
//            .attr("fill", "white");
//
//        d3.select(self.frameElement)
//            .style("height", diameter + "px");
//
//}
//
//function updateBubbleGraph(bubbleData){
////  if(svg_bubble ==null){
////    console.log("svg null.....");
////        return;
////    }
////	data = getBubbleData(bubbleData);
////	var dataset ={};
////   dataset["children"] = data;
////    console.log("data new... len",data);
////
//////    svg_bubble =  d3.select("#my_dataviz")
//////            .append("svg")
//////            .attr("width", diameter)
//////            .attr("height", diameter)
//////            .attr("class", "bubble");
////
////    var bubble = d3.pack(dataset)
////            .size([diameter, diameter])
////            .padding(1.5);
////
////            var nodes = d3.hierarchy(dataset)
////            .sum(function(d) {
////            return d.Count; });
////
////        var node = svg_bubble.selectAll(".node")
////            .data(bubble(nodes).descendants())
////            .enter()
////            .filter(function(d){
////                return  !d.children
////            })
////            .select(".node")
////            .attr("transform", function(d) {
////                return "translate(" + d.x + "," + d.y + ")";
////            });
////
////
////        node.selectAll(".bubble-title")
////            .text(function(d) {
////                return d.Name + ": " + Math.round(d.Count);
////            });
////
////        node.selectAll(".bubble-circle")
////            .attr("r", function(d) {
////
////                return d.r;
////            })
////            .style("fill", function(d) {
////                return myColor(d.data.Scale*10);
////            });
////
////        node.selectAll(".node-text-name")
////            .attr("dy", ".2em")
////            .style("text-anchor", "middle")
////            .text(function(d) {
////                return d.data.Name;
////            })
////            .attr("font-family", "sans-serif")
////            .attr("font-size", function(d){
////                return d.r/5;
////            })
////            .attr("fill", "white");
////
////        node.selectAll(".node-text-count")
////            .attr("dy", "1.3em")
////            .style("text-anchor", "middle")
////            .text(function(d) {
////                return d.data.Count;
////            })
////            .attr("font-family",  "Gill Sans", "Gill Sans MT")
////            .attr("font-size", function(d){
////                return d.r/5;
////            })
////            .attr("fill", "white");
////
////        d3.select(self.frameElement)
////            .style("height", diameter + "px");
////////////
//
//
//    if(svg_bubble ==null){
//    console.log("svg null.....");
//        return;
//    }
//	data = getBubbleData(bubbleData);
//	var dataset ={};
//    dataset["children"] = data;
//    //console.log("data new... len",data);
//
//	    var bubble = d3.pack(dataset)
//            .size([diameter, diameter])
//            .padding(1.5);
//
//            var nodes = d3.hierarchy(dataset)
//            .sum(function(d) {
//            //console.log("data is...", d.Count);
//            //console.log("data is...", d.Name);
//            return d.Count; });
//
//        var node = svg_bubble.selectAll(".node")
//            .data(bubble(nodes).descendants())
//
//         var enter = node.enter()
//         var exit = node.exit()
//
//
//            enter.filter(function(d){
//                return  !d.children
//            })
//            .select("g")
//            .attr("class", "node")
//            .attr("transform", function(d) {
//                return "translate(" + d.x + "," + d.y + ")";
//            });
//
//
//
//
//        node.select("title")
//            .text(function(d) {
//                return d.Name + ": " + Math.round(d.Count);
//            }).transition()
//	  .duration(750);
//
//        node.select("circle")
//            .attr("r", function(d) {
//                    return d.r;
//            })
//            .style("fill", function(d) {
//            //console.log("i......",d.data.Scale);
//                return myColor(d.data.Scale*10);
//            });
//
//        node.select("text")
//            .attr("dy", ".2em").transition()
//	  .duration(750)
//            .style("text-anchor", "middle")
//            .text(function(d) {
//                return d.data.Name;
//            })
//            .attr("font-family", "sans-serif")
//            .attr("font-size", function(d){
//                return d.r/5;
//            })
//            .attr("fill", "white");
//
//        node.select("text")
//            .attr("dy", "1.3em").transition()
//	  .duration(750)
//            .style("text-anchor", "middle")
//            .text(function(d) {
//                return d.data.Count;
//            })
//            .attr("font-family",  "Gill Sans", "Gill Sans MT")
//            .attr("font-size", function(d){
//                return d.r/5;
//            })
//            .attr("fill", "white");
//        exit.remove();
//
//        d3.select(self.frameElement)
//            .style("height", diameter + "px");
//	}
