class schoolMap {
    constructor() {}


    drawMap(d3, zipData, schoolData, priceData) {
        let h = document.documentElement.scrollHeight - 10;
        let w = document.documentElement.scrollWidth / 2;
        let textOnDisplay = "Number of Schools";
        let priceText = "Average Housing Price (In USD)";
        var loColorHiColor = ["#e3ecfc", "#173463"];
        var gradient = ["#E5F6FF", "#ACCEE1", "#73A7C4", "#3A7FA7", "#02588A"];
        var strokeColor = "white";
        var strokeHighlightColor = "#F6A600";
        var strokeWidth = 2;
        var strokeHighlightWidth = 3;
        var darkgrey = "#4c4c4c";
        var color = d3.scaleQuantize()
            .domain([0, 30])
            .range(gradient);
        var toolTipG;
        var toolTipWidth = 150, toolTipHeight = 50;
        var toolTipText = "No data";

        // let data = {"price":{"max":0}, "school":{"max":0}};
        let data = {"price":{}, "school":{}};
        for (let i of Object.entries(schoolData)) {
            data["school"][i[1].zip] = i[1].total_public_count + i[1].total_private_count;
            // data["school"]["max"] = Math.max(data["school"]["max"], i[1].total_public_count + i[1].total_private_count);
        }

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
        let svg = d3.select("#mapSchool").append("svg").attr("width", w).attr("height", h);

        // set the dimensions and margins of the graph
        var margin = {top: 50, right: 300, bottom: 500, left: 100},
            width = w - margin.left - margin.right,
            height = h - margin.top - margin.bottom;
        console.log("width", width, "height", height);

        // set the ranges
        var x = d3.scaleLinear().range([0, width]);
        var y = d3.scaleLinear().range([height, 0]);

        // define the line
        // var valueline = d3.line()
        //     .x(function(d) { return x(d.keyword); })
        //     .y(function(d) { return y(d.price); });

        var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        // append the svg obgect to the body of the page
        // appends a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        var svg2 = d3.select("#drawSchool").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");


        function drawData(data, keyword) {
            var arr = [];
            for (const [key, value] of Object.entries(data[keyword])) {
                // console.log(key, keyword + ": ", value, "price: ", data['price'][key]);
                arr.push({
                    "zipCode": key,
                    keyword: value,
                    'price': data['price'][key]
                });
            }
            // console.log(arr);
            // scale the range of the data
            x.domain([0, d3.max(arr, function(d) { return d.keyword; })]);
            y.domain([0, d3.max(arr, function(d) { return d.price; })]);

            // add the valueline path.
            // svg2.append("path")
            //     .data([arr])
            //     .attr("class", "line")
            //     .attr("d", valueline);

            // add the dots with tooltips
            svg2.selectAll("dot")
                .data(arr)
                .enter().append("circle")
                .attr("r", 5)
                // .attr("cx", function(d) { return x(d.zipCode); })
                .attr("cx", function(d) { return x(d.keyword); })
                .attr("cy", function(d) { return y(d.price); })
                .on("mouseover", function(d) {
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
                .text(priceText);


        }
        drawData(data, "school");


        // let svg1 = d3.select("#compare").append("svg").attr("width", w).attr("height", h);
        //
        let map = svg.selectAll("path").data(zipData.features).enter().append("path")
            .attr("d", path).style("fill", function(d) {
                return mapFillFunct(d);
            })
            .style("stroke", "white")
            .attr("id", function(d) {
                let zip = d.properties.ZCTA5CE10;
                center[zip] = path.centroid(d);
                return zip;
            })
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut)
            .on("mousemove", handleMouseMove);
            // # .on("click", handleMouseClick);
        var colorKeyWidth = 20, colorKeyHeight = 325, blockHeight = 40;
        var colorKeySVG = svg.append("g")
            .attr("transform", "translate(10, " + (h - colorKeyHeight - 10) + ")");
        for (var i = 0; i < gradient.length; i++) {
            colorKeySVG.append("rect")
                .datum([30 - (i + 1) * 6])
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
            .domain([0, 30])
            .range([200, 0])
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
            .attr("font-family", "Open Sans")
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
            .text(textOnDisplay);

        colorKeySVG.append("rect")
            .attr("x", 0)
            .attr("y", 225)
            .attr("width", colorKeyWidth)
            .attr("height", colorKeyWidth)
            .attr("fill", "black");

        colorKeySVG.append("text")
            .attr("x", 30)
            .attr("y", 235)
            .attr("class", "unselectable")
            .attr("dominant-baseline", "central")
            .attr("font-family", "Open Sans")
            .attr("font-size", "12px")
            .text("no data");



        function handleMouseOver() {
            console.log(this.id);

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
                .style('stroke', 'black')
                .style("pointer-events", "none")
                .style('opacity', 0.85);

            var priceForZipcode = data["school"][this.id];
            if (priceForZipcode) toolTipText = priceForZipcode;
            else toolTipText = "No data";
            toolTipG.append("text")
                .style("pointer-events", "none")
                .attr("dy", "1.2em")
                .attr("dx", "6")
                .attr("font-family", "Open Sans")
                .attr("font-size", "22px")
                .text(this.id);
            toolTipG.append("text")
                .style("pointer-events", "none")
                .attr("font-family", "Open Sans")
                .attr("font-size", "24px")
                .style("font-weight", 400)
                .attr("dy", "2.4em")
                .attr("dx", "6")
                .text(toolTipText);
        }

        function handleMouseOut() {
            // Clean up old tooltips
            d3.select(this).style("opacity", 1);
            svg.selectAll('g.tooltip').remove();
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
            var zipObject = data["school"][+d.properties.ZCTA5CE10];
            if (zipObject) {
                return color(zipObject);
            } else {
                return "black";
            }
        }

    }
}

module.exports = schoolMap;