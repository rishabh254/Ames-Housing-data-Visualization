var d_parallel_graph=[];
var parallel_slider=['OverallQual','SalePrice']

const width = 600, height = 250, padding = 50;
const lineGenerator = d3.line();
var pcSvg=null;

const features_parallel = [
  {name: 'SalePrice', range: [34900,755000]},
  {name: 'OverallQual', range: [1,10]},
  {name: 'GarageArea', range: [0,1418]},
  {name: 'GrLivArea', range: [334,5642]},
  {name: 'LotArea', range: [1300,115149]},
];
const xScale = d3.scalePoint()
  .domain(features_parallel.map(x=>x.name))
  .range([padding, width-padding]);

// Each vertical scale
const yScales = {};
features_parallel.map(x=>{
  yScales[x.name] = d3.scaleLinear()
    .domain(x.range)
    .range([height-padding, padding]);
});

yScales.team = d3.scaleOrdinal()
    .domain(features_parallel[0].range)
    .range([height-padding, padding]);

// Each axis generator
const yAxis = {};
d3.entries(yScales).map(x=>{
  yAxis[x.key] = d3.axisLeft(x.value);
});



const linePath = function(d){
  const _data = d3.entries(d).filter(x=>x!=null && x.key!=null && x.value!= null);
  let points = _data.map(x=>([xScale(x.key),yScales[x.key](x.value)]));
  return(lineGenerator(points));
}

function getParallelData(data){
    for (var i=0;i<data.length;i++)
	{
		data[i] = {
					SalePrice:   data[i].SalePrice1,
					OverallQual:   data[i].OverallQual1,
					GarageArea: data[i].GarageArea1,
					GrLivArea: data[i].GrLivArea1,
					LotArea: data[i].LotArea1
				   };
	}
	return data;
}

function drawInitialParallelGraph() {
d3.json("/get_mds/euclidean", function(d) {
	d_parallel_graph = JSON.parse(d.mds_orig);
	drawParallelGraph(d_parallel_graph.slice());
});
}

function drawParallelGraph(lineData) {
    data = getParallelData(lineData);
    pcSvg = d3.select("#parallel-div")
  .append('svg')
  .attr('width', width)
  .attr('height', height);

// Inactive data
pcSvg.append('g').attr('class','inactive').selectAll('path')
  .data(data)
  .enter()
    .append('path')
    .attr('d', d=>linePath(d));

// active data
pcSvg.append('g').attr('class','active').selectAll('path')
  .data(data)
  .enter()
    .append('path')
    .attr('d', d=>linePath(d)).style("stroke", function(d){ return( myColor(d.OverallQual))} )

// Vertical axis for the features
const featureAxisG = pcSvg.selectAll('g.feature')
  .data(features_parallel)
  .enter()
    .append('g')
      .attr('class','feature')
      .attr('transform',d=>('translate('+xScale(d.name)+',0)'));

featureAxisG
      .append('g')
      .each(function(d){
        d3.select(this).call(yAxis[d.name]);
      });

featureAxisG
  .append("text")
  .attr("text-anchor", "middle")
  .attr('y', padding/2)
  .text(d=>d.name);

}
