var d_parallel_graph = [];
var parallel_slider = features = ['LotArea1', 'ExterQual1', 'BsmtFinSF11', 'FireplaceQu1', 'KitchenQual1', 'YrSold1',
    'SalePrice1', 'OverallQual1', 'BsmtQual1', 'GarageArea1', "GrLivArea1"
]

const width = 600,
    height = 270,
    padding = 50,
    brush_width = 20;
const lineGenerator = d3.line();
var pcSvg = null;

const features_parallel = [{
        name: 'SalePrice1',
        range: [34900, 580000]
    },
    {
        name: 'OverallQual1',
        range: [1, 10]
    },
    {
        name: 'BsmtQual1',
        range: [1, 5]
    },
    {
        name: 'GarageArea1',
        range: [0, 1418]
    },
    {
        name: 'GrLivArea1',
        range: [334, 5642]
    }

];
const xScale = d3.scalePoint()
    .domain(features_parallel.map(x => x.name))
    .range([padding, width - padding]);

// Each vertical scale
const yScales = {};
features_parallel.map(x => {
    yScales[x.name] = d3.scaleLinear()
        .domain(x.range)
        .range([height - padding, padding]);
});

yScales.team = d3.scaleOrdinal()
    .domain(features_parallel[0].range)
    .range([height - padding, padding]);

// Each axis generator
const yAxis = {};
d3.entries(yScales).map(x => {
    yAxis[x.key] = d3.axisLeft(x.value);
});


const brushEventHandler = function(feature) {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom")
        return; // ignore brush-by-zoom
    if (d3.event.selection != null) {
        features_parallel[feature] = d3.event.selection.map(d => yScales[feature].invert(d));
    } else {
        if (feature in features_parallel)
            delete(features_parallel[feature]);
    }


    for (var i = 0; i < features.length; i++) {

        if (features[i] in features_parallel) {
            currMin[i] = features_parallel[features[i]][1];
            currMax[i] = features_parallel[features[i]][0];
        }

    }
    
    updateDcm();
    applyFilters();
    updateBubble();
    updateLineData();
}

const yBrushes = {};
d3.entries(yScales).map(x => {
    let extent = [
        [-(brush_width / 2), padding],
        [brush_width / 2, height - padding]
    ];
    yBrushes[x.key] = d3.brushY()
        .extent(extent)
        .on('brush', () => brushEventHandler(x.key))
        .on('end', () => brushEventHandler(x.key));
});


const linePath = function(d) {
    const _data = d3.entries(d).filter(x => x != null && x.key != null && x.value != null && (x.key == 'SalePrice1' || x.key == 'OverallQual1' || x.key == 'GarageArea1' || x.key == 'BsmtQual1' || x.key == 'GrLivArea1'));
   
    let points = _data.map(x => (

        [xScale(x.key), yScales[x.key](x.value)]));
    return (lineGenerator(points));
}

function getParallelData(data) {
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
    pcSvg.append('g').attr('class', 'inactive').selectAll('path')
        .data(data)
        .enter()
        .append('path')
        .attr('d', d => linePath(d));

    // active data
    pcSvg.append('g').attr('class', 'active').selectAll('path')
        .data(data)
        .enter()
        .append('path')
        .attr('d', d => linePath(d)).style("stroke", function(d) {
            return (
                myColor(d.score * 10))
        })

    // Vertical axis for the features
    const featureAxisG = pcSvg.selectAll('g.feature')
        .data(features_parallel)
        .enter()
        .append('g')
        .attr('class', 'feature')
        .attr('transform', d => ('translate(' + xScale(d.name) + ',0)'));

    featureAxisG
        .append('g')
        .attr("class", "axisWhite")
        .each(function(d) {
            d3.select(this).
            call(yAxis[d.name]);
        });

    featureAxisG
        .each(function(d) {
            d3.select(this)
                .append('g')
                .attr('class', 'brush')
                .call(yBrushes[d.name]);
        });



    featureAxisG
        .append("text")
        .attr("width", 60)
        .attr("height", 20)
        .style("cursor", "pointer")
        .attr("id", d => "btn-" + d.name.substring(0, d.name.length - 1))
        .on('click', d => {

            if (!scoreFeatures.includes(d.name.substring(0, d.name.length - 1))) {
                d3.select("#" + "btn-" + d.name.substring(0, d.name.length - 1))
                    .style("fill", "#65B3b3");
                scoreFeatures.push(d.name.substring(0, d.name.length - 1));
            } else {
                d3.select("#" + "btn-" + d.name.substring(0, d.name.length - 1))
                    .style("fill", "#e3e3e3");
                var index = scoreFeatures.indexOf(d.name.substring(0, d.name.length - 1));
                scoreFeatures.splice(index, 1);
            }

            updateDcm();
            applyFilters();
            updateBubble();
            updateLineData();

        })
        .attr("text-anchor", "middle")
        .attr('y', padding / 2)
        .attr("fill", textColor)
        .text(d => d.name.substring(0, d.name.length - 1));

}