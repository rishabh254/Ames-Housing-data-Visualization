var dataset ={};


function bubble_test(){

d3.json("/get_bubble_data", function(data) {
get_coorect_data(data);


 var diameter = 600;

var svg = d3.select("#my_dataviz")
            .append("svg")
            .attr("width", diameter)
            .attr("height", diameter)
            .attr("class", "bubble");


        var color = d3.scaleOrdinal(d3.schemeCategory20);

        var myColor = d3.scaleLinear().domain([0,10]).range(["white", "blue"])

        var bubble = d3.pack(dataset)
            .size([diameter, diameter])
            .padding(1.5);



        var nodes = d3.hierarchy(dataset)
            .sum(function(d) { return d.Count; });

        var node = svg.selectAll(".node")
            .data(bubble(nodes).descendants())
            .enter()
            .filter(function(d){
                return  !d.children
            })
            .append("g")
            .attr("class", "node")
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

        node.append("title")
            .text(function(d) {
                return d.Name + ": " + Math.round(d.Count);
            });

        node.append("circle")
            .attr("r", function(d) {

                return d.r;
            })
            .style("fill", function(d) {
            console.log("i......",d.data.scale);

                return myColor(d.data.scale*10);
            });

        node.append("text")
            .attr("dy", ".2em")
            .style("text-anchor", "middle")
            .text(function(d) {
                return d.data.Name;
            })
            .attr("font-family", "sans-serif")
            .attr("font-size", function(d){
                return d.r/5;
            })
            .attr("fill", "white");

        node.append("text")
            .attr("dy", "1.3em")
            .style("text-anchor", "middle")
            .text(function(d) {
                return d.data.Count;
            })
            .attr("font-family",  "Gill Sans", "Gill Sans MT")
            .attr("font-size", function(d){
                return d.r/5;
            })
            .attr("fill", "white");

        d3.select(self.frameElement)
            .style("height", diameter + "px");


})

}