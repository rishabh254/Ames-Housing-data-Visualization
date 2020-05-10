function updateOrig_matrix() {
    if (d3.select("#myCheckboxOrig").property("checked")) {
        updateScatter_matrix(0, 1);
        updateScatter_matrix(1, 0);
        updateScatter_matrix(2, 0);
        d3.selectAll('#myCheckboxRand').property('checked', false);
        d3.selectAll('#myCheckboxStrat').property('checked', false);

    } else {
        updateScatter_matrix(0, 0);
    }
}

function updateRand_matrix() {
    if (d3.select("#myCheckboxRand").property("checked")) {
        updateScatter_matrix(0, 0);
        updateScatter_matrix(1, 1);
        updateScatter_matrix(2, 0);
        d3.selectAll('#myCheckboxStrat').property('checked', false);
        d3.selectAll('#myCheckboxOrig').property('checked', false);

    } else {
        updateScatter_matrix(1, 0);
    }
}

function updateStrat_matrix() {
    if (d3.select("#myCheckboxStrat").property("checked")) {
        updateScatter_matrix(0, 0);
        updateScatter_matrix(1, 0);
        updateScatter_matrix(2, 1);
        d3.selectAll('#myCheckboxOrig').property('checked', false);
        d3.selectAll('#myCheckboxRand').property('checked', false);

    } else {
        updateScatter_matrix(2, 0);
    }
}

function updateScatter_matrix(dataType, visibility) {
    switch (dataType) {
        case 0:
            d3.select("body").selectAll(".orig").style("opacity", visibility * 0.2);
            break;
        case 1:
            d3.select("body").selectAll(".random").style("opacity", visibility * 0.2);
            break;
        case 2:
            d3.select("body").selectAll(".stratified").style("opacity", visibility * 0.2);
            break;
    }
}

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

function combo(a, b) {
                console.log(a[0]);
                console.log(b);
                var arr = [];
   
                for (i = 0; i < a.length;i++)
                    for (j = 0; j < b.length;j++) arr.push({
                        x: a[i],
                        i: i,
                        y: b[j],
                        j: j
                    });
                return arr;
            }

function drawscatterMatrix() {

    d3.json("/get_scatter_matrix_data",
        function(d) {


            d_scatter_orig = (JSON.parse(d.scatter_orig));
            d_scatter_random = (JSON.parse(d.scatter_random));
            d_scatter_stratified = (JSON.parse(d.scatter_stratified));

            d_scatter_orig.forEach(function(obj) {
                obj['sampleType'] = 'orig';
            });
            d_scatter_random.forEach(function(obj) {
                obj['sampleType'] = 'random';
            });
            d_scatter_stratified.forEach(function(obj) {
                obj['sampleType'] = 'stratified';
            });

            d_scatter = d_scatter_orig.concat(d_scatter_random);
            d_scatter = d_scatter.concat(d_scatter_stratified);

            var cols = Object.keys(d_scatter[0]).slice(0, 3);
            num_cols = cols.length;

            d_scatter.forEach(function(d) {
                cols.forEach(function(col) {
                    return d[col] = +d[col];
                });
            });

            var domainByCol = {};
            cols.forEach(function(col) {
                domainByCol[col] = d3.extent(d_scatter,
                    function(d) {
                        return d[col];
                    });
            });

            var leftMargin = 10;
            var rightMargin = 10;
            var topMargin = 40;
            var bottomMargin = 40;
            var height = 800;
            var width = 700;

            var size = (width / num_cols) - 12,
                padding = 20;

            // x axis scale
            var widthScale = d3.scaleLinear()
                .range([leftMargin, size - leftMargin]);

            // y axis scale
            var heightScale = d3.scaleLinear()
                .range([size - leftMargin, leftMargin]);

            var colorScale = ["red", "blue", "green"];

            // x axis
            var x_axis = d3.axisBottom(widthScale)
                .ticks(5)
                .tickSize(size * num_cols)
                .tickFormat(d3.format("d"));
            // y axis
            var y_axis = d3.axisLeft(heightScale)
                .ticks(5)
                .tickSize(-size * num_cols)
                .tickFormat(d3.format("d"));

            // color scale
            var color = d3.scaleOrdinal()
                .domain(cols)
                .range(colorScale);

            var container = d3.select("body")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("style", "margin-left:20em;margin-right:20em;margin-top:2em")
                .attr("viewBox", "-50 0 " + width + " " + height);


            var canvas = container.append("g")
                .attr("transform", "translate(" + leftMargin + "," + topMargin + ")");

            canvas
                .selectAll(".x.axis")
                .data(cols)
                .enter().append("g")
                .attr("class", "x axis")
                .attr("transform", function(d, i) {
                    return "translate(" + (num_cols - i - 1) * size + ",0)";
                })
                .style("opacity", 0.5)
                .each(function(d) {
                    widthScale.domain(domainByCol[d]).nice();
                    d3.select(this).call(x_axis);
                });

            canvas.selectAll(".y.axis")
                .data(cols)
                .enter().append("g")
                .attr("class", "y axis")
                .attr("transform", function(d, i) {
                    return "translate(0," + i * size + ")";
                })
                .each(function(d) {
                    heightScale.domain(domainByCol[d]);
                    d3.select(this).call(y_axis);
                });

            var cell = canvas.selectAll(".cell")
                .data(combo(cols, cols))
                .enter().append("g")
                .attr("class", "cell")
                .attr("transform", function(d) {
                    return "translate(" + (num_cols - d.i - 1) * size + "," + d.j * size + ")";
                })
                .each(plot);

            // Titles for the diagonal.
            cell.filter(function(d) {
                    return d.i === d.j;
                }).append("text")
                .attr("x", size / 2)
                .attr("y", size / 2)
                .attr("text-anchor", "middle")
                .text(function(d) {
                    return d.x;
                });


            function plot(p, data) {

                var cell = d3.select(this);

                widthScale.domain(domainByCol[p.x]);
                heightScale.domain(domainByCol[p.y]);

                cell.append("rect")
                    .attr("class", "frame")
                    .classed("diagonal", function(d) {
                        return d.i === d.j;
                    })
                    .attr("x", leftMargin)
                    .attr("y", leftMargin)
                    .style("fill", function(d) {
                        return "#ffffff";
                    })
                    .style("opacity", function(d) {
                        if (d.i == d.j) return 1;
                        else return 0;
                    })
                    .attr("width", size - padding)
                    .attr("height", size - padding)
                    ;

                cell.filter(function(d) {
                        return d.i !== d.j;
                    }) // hide diagonal marks
                    .selectAll("circle")
                    .data(d_scatter)
                    .enter().append("circle")
                    .style("opacity", 0)
                    .attr("class", function(d) {
                        return d.sampleType;
                    })
                    .attr("cx", function(d) {
                        return widthScale(d[p.x]);
                    })
                    .attr("cy", function(d) {
                        return heightScale(d[p.y]);
                    })
                    .attr("r", 6)
                    .style("fill", function(d) {
                        return color(d['clusterNo']);
                    })
                    .style("opacity", function(d) {
                        if (d.sampleType == "orig") return 0.2;
                        else return 0;
                    });
                //.style("opacity", 0.2);


            }

        });

}