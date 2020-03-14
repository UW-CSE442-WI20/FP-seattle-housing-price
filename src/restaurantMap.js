class restaurantMap {
    constructor() {}


    drawMap(d3, zipData, restData, priceData) {
        var theme = "Restaurant";
        var textElementID = "description" + theme;
        var scatterPlotID = "draw" + theme;
        var mapID = "map" + theme;

        var element = document.getElementById(textElementID);

        //If it isn't "undefined" and it isn't "null", then it exists.
        if(typeof(element) != 'undefined' && element != null){
            // alert('Element exists!');
            document.getElementById(textElementID).remove();

        }
        let h = document.documentElement.scrollHeight - 10;
        let w = document.documentElement.scrollWidth / 2;
        let textOnDisplay = "Restaurant Count";
        let priceText = "Average Housing Price (In USD)";
        let maxValue = 24;
        var loColorHiColor = ["#e3ecfc", "#173463"];
        // var gradient = ["#E5F6FF", "#ACCEE1", "#73A7C4", "#3A7FA7", "#02588A"];
        var gradient = ["#CFF4D2", "#7BE495", "#56c596", "#329D9C", "#205072"];
        var strokeColor = "white";
        var strokeHighlightColor = "#F6A600";
        var strokeWidth = 2;
        var strokeHighlightWidth = 3;
        var darkgrey = "#4c4c4c";

        var toolTipG;
        var toolTipWidth = 60, toolTipHeight = 40;
        var toolTipText = "No data";

        // let data = {"price":{"max":0}, "rest":{"max":0}};
        let data = {"price":{}, "rest":{}};
        for (let i of Object.entries(restData)) {
            data["rest"][i[1].zip] = i[1].total_count;
            maxValue = Math.max(i[1].total_count, maxValue);
            // data["rest"]["max"] = Math.max(data["rest"]["max"], i[1].total_public_count + i[1].total_private_count);
        }

        var color = d3.scaleQuantize()
            .domain([0, maxValue])
            .range(gradient);

        for (let i of Object.entries(priceData)) {
            data["price"][i[0]] = i[1];
            // data["price"]["max"] = Math.max(data["price"]["max"], i[1]);
        }

        let center = {};
        let projection = d3.geoAlbers().translate([w/3, h/2])
            .scale([120 * w])
            .center([0,47.5])
            .rotate([122.4,0]);
        let path = d3.geoPath().projection(projection);
        let svg = d3.select("#" + mapID).append("svg").attr("width", w).attr("height", h);

        // set the dimensions and margins of the graph
        var margin = {top: 50, right: 300, bottom: 500, left: 100},
            width = w - margin.left - margin.right,
            height = h - margin.top - margin.bottom;
        // console.log("width", width, "height", height);

        // set the ranges
        var x = d3.scaleLinear().range([0, width]);
        var y = d3.scaleLinear().range([height, 0]);

        // define the line
        // var valueline = d3.line()
        //     .x(function(d) { return x(d.keyword); })
        //     .y(function(d) { return y(d.price); });

        // append the svg obgect to the body of the page
        // appends a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        var svg2 = d3.select("#" + scatterPlotID).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height * 1.6)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");


        function drawData(data, keyword) {
            var x_data = [];
            var arr = [];
            var x_mean = 0;
            var y_mean = 0;
            var arr_length = Object.keys(data[keyword]).length;
            var term1 = 0;
            var term2 = 0;
            var i = 0;

            for (const [key, value] of Object.entries(data[keyword])) {
                // console.log(key, keyword + ": ", value, "price: ", data['price'][key]);
                x_data[i] = value;
                x_mean += value;
                y_mean += data['price'][key];
                i += 1;
            }
            x_mean /= arr_length;
            y_mean /= arr_length;

            // calculate coefficients
            var xr = 0;
            var yr = 0;
            for (const [key, value] of Object.entries(data[keyword])) {
                xr = value - x_mean;
                yr = data['price'][key] - y_mean;
                term1 += xr * yr;
                term2 += xr * xr;

            }
            var b1 = term1 / term2;
            var b0 = y_mean - (b1 * x_mean);
            var yhat = [];
            // fit line using coeffs
            for (i = 0; i < arr_length; i++) {
                yhat.push(b0 + (x_data[i] * b1));
            }
            console.log(yhat);

            i = 0;
            for (const [key, value] of Object.entries(data[keyword])) {
                // console.log(key, keyword + ": ", value, "price: ", data['price'][key]);
                arr.push({
                    "zipCode": key,
                    keyword: value,
                    'price': data['price'][key],
                    'price_hat': yhat[i]
                });
                i++;
            }
            // console.log(arr);
            // scale the range of the data
            x.domain([0, d3.max(arr, function(d) { return d.keyword; })]);
            y.domain([0, d3.max(arr, function(d) { return d.price; })]);

            var line = d3.line()
                .x(function(d) {
                    return x(d.keyword);
                })
                .y(function(d) {
                    return y(d.price_hat);
                });

            svg2.append("path")
                .datum(arr)
                .attr("class", "line")
                .attr("d", line);

            // add the dots with tooltips
            svg2.selectAll("dot")
                .data(arr)
                .enter().append("circle")
                .attr("id", function(d) { return theme + d.zipCode + "dot";})
                .attr("r", 5)
                .attr("fill", function(d) {
                    // console.log(d);
                    return color(d.keyword);
                })
                .attr("cx", function(d) { return x(d.keyword); })
                .attr("cy", function(d) { return y(d.price); })
                .on("mouseover", function(d) {
                    var div = d3.select("body").append("div")
                        .attr("class", "tooltip").style("opacity", 0);
                    d3.select(this).style("fill", "#f95e0a");
                    // svg2.select(d).attr("fill", "#f95e0a");
                    document.getElementById(d.zipCode+theme).style.fill = "#f95e0a";
                    div.transition()
                        .duration(200)
                        .style("opacity", .9);
                    div .html(
                        d.zipCode + "<br/>" + d.keyword +
                        "<br/>"  + "<b>" + "$" + d.price + "<b/>")
                        .style("left", (d3.event.pageX - 15) + "px")
                        .style("top", (d3.event.pageY - 60) + "px");

                })
                .on("mouseout", function(d) {
                    document.getElementById(d.zipCode+theme).style.fill = color(d.keyword);
                    d3.select(this).style("fill", color(d.keyword));
                    d3.selectAll(".tooltip").transition()
                        .duration(200)
                        .style("opacity", 0).remove();
                });
            // add the X Axis
            svg2.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

            // Add X axis label:
            svg2.append("text")
                .attr("text-anchor", "end")
                .attr("x", width)
                .attr("y", height + margin.top)
                .attr("font-size", "12px")
                .text(textOnDisplay);

            // add the Y Axis
            svg2.append("g")
                .call(d3.axisLeft(y));

            // Y axis label:
            svg2.append("text")
                .attr("text-anchor", "end")
                .attr("transform", "rotate(-90)")
                .attr("y", -margin.left + 20)
                .attr("x", -margin.top + 40)
                .attr("font-size", "12px")
                .text(priceText);




        }
        drawData(data, "rest");

        var para = document.createElement("P");
        para.setAttribute("id", textElementID);

        para.innerHTML = "From the graph, we can see that the data points appear scattered all over the plot. " +
            "Therefore there is no obvious association between the number of restaurants and the housing prices.";
        document.getElementById(scatterPlotID).appendChild(para);
        var textWidth = width * 1.4;
        document.getElementById(textElementID).style.width = textWidth + "px";



        // let svg1 = d3.select("#compare").append("svg").attr("width", w).attr("height", h);
        //
        let map = svg.selectAll("path").data(zipData.features).enter().append("path")
            .attr("d", path).style("fill", function(d) {
                return mapFillFunct(d);
            })
            .style("stroke", "white")
            .style("stroke-width", 2)
            .attr("id", function(d) {
                let zip = d.properties.ZCTA5CE10;
                center[zip] = path.centroid(d);
                return zip + theme;
            })
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut)
            .on("mousemove", handleMouseMove);
        // # .on("click", handleMouseClick);
        var colorKeyWidth = h / 60, blockHeight = h / 30, colorKeyHeight = blockHeight * gradient.length;
        var colorKeySVG = svg.append("g")
            .attr("transform", "translate(" + h / 6 + ", " + (colorKeyHeight + h / 6) + ")");
        for (var i = 0; i < gradient.length; i++) {
            colorKeySVG.append("rect")
                .datum([maxValue - (i + 1) * maxValue / 5])
                .attr("x", 0)
                .attr("y", i * blockHeight)
                .attr("width", colorKeyWidth)
                .attr("height", blockHeight)
                .attr("fill", function(d) {
                    // console.log(d);
                    return color(d);
                });
        }
        var colorScale = d3.scaleLinear()
            .domain([0, maxValue - 1])
            .range([colorKeyHeight, 0])
            .nice();
        colorKeySVG.append("g")
            .call(d3.axisRight(colorScale)
                // .tickFormat(d3.format("$,"))
                .tickSize(0)
                .tickValues(
                    colorScale.ticks(5)
                        .concat(colorScale.domain())))
            .attr("transform", "translate(" + colorKeyWidth + ", 0)")
            .selectAll("text")
            .attr("class", "unselectable")
            // .attr("font-family", "Open Sans")
            .attr('font-size', "12px")
            .attr("fill", darkgrey)
            .attr("dx", "2px");

        colorKeySVG.selectAll("path")
            .remove();

        colorKeySVG.append("text")
            .attr("transform", "rotate(-90)")
            .attr("transform", "translate(0, -40)")
            .attr("dy", "1em")
            .attr("fill", darkgrey)
            .attr("class", "unselectable")
            .attr("font-size", "12px")
            .text(textOnDisplay);

        colorKeySVG.append("rect")
            .attr("x", 0)
            .attr("y", colorKeyHeight)
            .attr("width", colorKeyWidth)
            .attr("height", colorKeyWidth)
            .attr("fill", "lightgrey");

        colorKeySVG.append("text")
            .attr("x", h / 30)
            .attr("y", colorKeyHeight + 10)
            .attr("class", "unselectable")
            .attr("dominant-baseline", "central")
            // .attr("font-family", "Open Sans")
            .attr("font-size", "12px")
            .text("no data");



        function handleMouseOver() {
            var id = this.id.slice(0, 5)
            var element = document.getElementById(theme + id + "dot");

            //If it isn't "undefined" and it isn't "null", then it exists.
            if(typeof(element) != 'undefined' && element != null){
                // alert('Element exists!');
                document.getElementById(theme + id + "dot").style.fill = "#f95e0a";

            }

            d3.select(this).style("opacity", .7);
            // Clean up old tooltips
            svg.selectAll('g.tooltip').remove();
            // Append tooltip
            toolTipG = svg.append("g").attr('class', 'tooltip');

            toolTipG.append("rect")
                .style('position', 'absolute')
                .style('z-index', 1001)
                .style('width', toolTipWidth)
                .style('height', toolTipHeight)
                .style('fill', 'white')
                .style('', 'black')
                .style("pointer-events", "none")
                .style('opacity', 0.70);

            var priceForZipcode = data["rest"][id];
            if (priceForZipcode) toolTipText = priceForZipcode;
            else toolTipText = "No data";
            toolTipG.append("text")
                .style("pointer-events", "none")
                .attr("dy", "1.2em")
                .attr("dx", "6")
                // .attr("font-family", "Open Sans")
                .attr("font-size", "14px")
                .text(id);
            toolTipG.append("text")
                .style("pointer-events", "none")
                // .attr("font-family", "Open Sans")
                .attr("font-size", "14px")
                .style("font-weight", 400)
                .attr("dy", "2.4em")
                .attr("dx", "6")
                .text(toolTipText);
        }

        function handleMouseOut() {
            // Clean up old tooltips
            var dot = document.getElementById(theme + this.id.slice(0, 5) + "dot");
            if (dot) {
                dot.style.fill = color(data["rest"][this.id.slice(0, 5)]);
            }
            d3.select(this).style("opacity", 1);
            svg.selectAll('g.tooltip').transition()
                .duration(100)
                .style("opacity", 0);
            // svg.selectAll('g.tooltip').remove();
        }

        function handleMouseMove() {
            toolTipText = "" + this.id;
            var xPos = d3.mouse(this)[0] - 15;
            var yPos = d3.mouse(this)[1] - 80;
            if (yPos - toolTipHeight < 0) {
                yPos = yPos + 65;
                xPos = xPos + 30;
            }
            toolTipG.attr("transform", "translate(" + xPos +"," + yPos + ")");
        }

        function mapFillFunct(d) {
            var zipObject = data["rest"][+d.properties.ZCTA5CE10];
            if (zipObject) {
                return color(zipObject);
            } else {
                return "lightgrey";
            }
        }

    }
}

module.exports = restaurantMap;