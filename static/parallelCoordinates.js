var d_parallel_graph=[];
var parallel_slider=['OverallQual1','SalePrice1','LotArea1','GarageArea1','KitchenQual1','YrSold1']

const width = 600, height = 300, padding = 75;
const lineGenerator = d3.line();
var pcSvg=null;

const features_parallel = [
  {name: 'SalePrice1', range: [34900,755000]},
  {name: 'OverallQual1', range: [1,10]},
  {name: 'LotArea1', range: [1300,115149]},
  {name: 'GarageArea1', range: [0,1418]},
  {name: 'GrLivArea1', range: [334,5642]}
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
//console.log("x...",x);

  yAxis[x.key] = d3.axisLeft(x.value);
});



const linePath = function(d){
  const _data = d3.entries(d).filter(x=>x!=null && x.key!=null && x.value!= null && x.key!="score" && x.key!="SalePrice" && x.key!= "YrSold1" && x.key!= "KitchenQual1"
  && x.key!= "OverallQual" && x.key!="GarageArea" && x.key!="GrLivArea" && x.key!= "LotArea");
  //console.log("_data...",_data);
  let points = _data.map(x=>(

  [xScale(x.key),yScales[x.key](x.value)]));
  return(lineGenerator(points));
}

function getParallelData(data){
    for (var i=0;i<data.length;i++)
	{
		data[i] = {
					SalePrice1:   data[i].SalePrice1,
					OverallQual1:   data[i].OverallQual1,
					GarageArea1: data[i].GarageArea1,
					GrLivArea1: data[i].GrLivArea1,
					LotArea1: data[i].LotArea1,
					YrSold1: data[i].YrSold1,
					KitchenQual1: data[i].KitchenQual1,
					SalePrice:   data[i].SalePrice,
					OverallQual:   data[i].OverallQual,
					GarageArea: data[i].GarageArea,
					GrLivArea: data[i].GrLivArea,
					LotArea: data[i].LotArea,
					score: data[i].score
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
    .attr('d', d=>linePath(d)).style("stroke", function(d){
    //console.log("cocor...", d);
    return(
    myColor(d.score*10))} )

// Vertical axis for the features
const featureAxisG = pcSvg.selectAll('g.feature')
  .data(features_parallel)
  .enter()
    .append('g')
      .attr('class','feature')
      .attr('transform',d=>('translate('+xScale(d.name)+',0)'));

featureAxisG
      .append('g')
	  .attr("class", "axisWhite")
      .each(function(d){
        d3.select(this).
		call(yAxis[d.name]);
      });

featureAxisG
  .append("text")
  .attr("text-anchor", "middle")
  .attr('y', padding/2)
  .attr("fill", textColor)
  .text(d=>d.name.substring(0, d.name.length-1));

}
