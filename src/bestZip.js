import Sortable from 'sortablejs';
var prevParameters = []
var whetherControl = false;

class bestZip {
    constructor() {
    }
    

    drawGraph(d3, zipData, busData, companyData, crimeData, groceryData, priceData, linkData, restData, schoolData, redraw) {

        // Warn if overriding existing method
        if(Array.prototype.equals)
        console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
        // attach the .equals method to Array's prototype to call it on any array
        Array.prototype.equals = function (array) {
        // if the other array is a falsy value, return
        if (!array)
            return false;

        // compare lengths - can save a lot of time 
        if (this.length != array.length)
            return false;

        for (var i = 0, l=this.length; i < l; i++) {
            // Check if we have nested arrays
            if (this[i] instanceof Array && array[i] instanceof Array) {
                // recurse into the nested arrays
                if (!this[i].equals(array[i]))
                    return false;       
            }           
            else if (this[i] != array[i]) { 
                // Warning - two different object instances will never be equal: {x:20} != {x:20}
                return false;   
            }           
        }       
        return true;
        }
        // Hide method from for-in loops
        Object.defineProperty(Array.prototype, "equals", {enumerable: false});

        var $ = require('jQuery');

        
        var whetherTextShown = true;
        var whetherSameParameters = false;

        // dragAndDrop List
        var sortLeft = new Sortable(leftList, {
            group: 'shared', // set both lists to same group
            animation: 150
        });
        
        var sorRight = new Sortable(rightList, {
            group: 'shared',
            animation: 150
        });
        
        var searchButton = document.getElementById("search");
        var scores;

        var prevBestZip = "";

        searchButton.onclick = function(){
            
            var parameters = sorRight.toArray();
            if (parameters.length == 0) {
                d3.select("#bestZipMap").select("svg").selectAll("path").transition()
                    .style("fill", "lightgrey").style("stroke", "white").duration(1000);
                d3.select("#bestZipAnalysis").select("svg").remove();
                $("#zipH4").remove();
                prevParameters = [];
                whetherControl = false;
                return;
            }
            if (prevParameters.equals(parameters)) {
                whetherSameParameters = true;
            } else {
                whetherSameParameters = false;
            }
            prevParameters = parameters.slice();
            if (parameters.length > 0) {
                if (whetherTextShown) {
                    var tag = document.createElement("h4");
                    tag.setAttribute("id", "zipH4");
                    var element = document.getElementById("bestZipAnalysis");
                    element.appendChild(tag);
                }
                whetherControl = true;
            }
            scores = getZipScore(parameters);
            d3.select("#bestZipMap").select("svg").selectAll("path").transition().style("fill", function(d) {
                return mapFillFunct(d, scores);
            }).duration(1000);
                    // best zipcode Analysis
            if (whetherControl && !whetherSameParameters) {
                var bestZipCode = Object.keys(scores).reduce(function(a, b){ return scores[a] > scores[b] ? a : b });
                if (prevBestZip !== "") {
                    document.getElementById(prevBestZip+"bestZip").style["stroke"] = "white";
                }
                prevBestZip = bestZipCode;
                document.getElementById(bestZipCode+"bestZip").style["stroke"] = "black";
                $('#'+bestZipCode+"bestZip").parent().append($('#'+bestZipCode+"bestZip"));
                if (whetherTextShown) {
                    $("#zipH4").text("Your Best Match District: " + bestZipCode).fadeIn(1000);
                    whetherTextShown = false;
                } else {
                    $("#zipH4").fadeOut(500, function() {
                        $("#zipH4").text("Your Best Match District: " + bestZipCode).fadeIn(500);
                     })
                }
                var data_best = getZipAnaData(bestZipCode, parameters);
                d3.select("#bestZipAnalysis").select("svg").remove();
                drawZipCodeAnalysis(data_best);
            }
        };

        // get the score for each zipCode
        function getZipScore(parameters) {
            var parameters_weights;
            if (parameters.length == 1) {
                parameters_weights = [1];
            }
            if (parameters.length == 2) {
                parameters_weights = [0.6, 0.4];
            }
            if (parameters.length == 3) {
                parameters_weights = [0.5, 0.3, 0.2];
            }
            if (parameters.length == 4) {
                parameters_weights = [0.4, 0.3, 0.2, 0.1];
            }
            if (parameters.length == 5) {
                parameters_weights = [0.4, 0.3, 0.15, 0.1, 0.05];
            }
            if (parameters.length == 6) {
                parameters_weights = [0.35, 0.25, 0.2, 0.1, 0.07, 0.03];
            }
            if (parameters.length == 7) {
                parameters_weights = [0.35, 0.23, 0.15, 0.12, 0.08, 0.04, 0.03];
            }
            var resultMap = {};
            for (let zip of zipCodes) {
                resultMap[zip] = 0;
            }
            for(let index in parameters) {
                for (let zip of zipCodes) {
                    resultMap[zip] += rankData[parameters[index]][zip] * parameters_weights[index];
                }
            }
            var max = 0;
            for (let zip of zipCodes) {
                max = Math.max(max, resultMap[zip]);
            }
            // get score for each zipcode
            for (let zip of zipCodes) {
                resultMap[zip] = parseInt(resultMap[zip] / max * 100, 10);
            }
            return resultMap
        }

        // Map
        let h = document.documentElement.scrollHeight - 10;
        let w = document.documentElement.scrollWidth / 2;
        var gradient = ["#ffd7e7", "#ffc7cc", "#f7b581", "#f09771", "#e67867", "#d95964", "#c73866"];
        var color = d3.scaleThreshold()
            .domain([20, 35, 50, 65, 80, 95])
            .range(gradient);
        var toolTipG;
        var toolTipWidth = 140, toolTipHeight = 50;
        var toolTipText = "No data";

        var zipCodes = [];
        for (let feature of zipData.features) {
            zipCodes.push(feature.properties.ZCTA5CE10)
        }

        let data = {"bus":{"max":0}, "company":{"max":0}, "crime":{"max":0}, "grocery":{"max":0},
            "price":{"max":0}, "link":{"max":0}, "rest":{"max":0}, "school":{"max":0}, "transportation":{"max":0}};
        for (let i of Object.entries(busData)) {
            if (zipCodes.includes(i[1].zip)) {
                data["bus"][i[1].zip] = i[1].total_count;
                data["bus"]["max"] = Math.max(data["bus"]["max"], i[1].total_count);
            }
        }
        for (let i of Object.entries(companyData)) {
            if (zipCodes.includes(i[1].zip)) {
                data["company"][i[1].zip] = i[1].count_total;
                data["company"]["max"] = Math.max(data["company"]["max"], i[1].count_total);
            }
        }
        for (let i of Object.entries(crimeData)) {
            if (zipCodes.includes(i[1].zip)) {
                data["crime"][i[1].zip] = i[1].count_total;
                data["crime"]["max"] = Math.max(data["crime"]["max"], i[1].count_total);
            }
        }
        for (let i of Object.entries(groceryData)) {
            if (zipCodes.includes(i[1].zip)) {
                data["grocery"][i[1].zip] = i[1].total_count;
                data["grocery"]["max"] = Math.max(data["grocery"]["max"], i[1].total_count);
            }
        }
        for (let i of Object.entries(priceData)) {
            if (zipCodes.includes(i[0])) {
                data["price"][i[0]] = i[1];
                data["price"]["max"] = Math.max(data["price"]["max"], i[1]);
            }
        }
        for (let i of Object.entries(linkData)) {
            if (zipCodes.includes(i[1].zip)) {
                data["link"][i[1].zip] = i[1].total_count;
                data["link"]["max"] = Math.max(data["link"]["max"], i[1].total_count);
            }
        }
        for (let i of Object.entries(restData)) {
            if (zipCodes.includes(i[1].zip)) {
                data["rest"][i[1].zip] = i[1].total_count;
                data["rest"]["max"] = Math.max(data["rest"]["max"], i[1].total_count);
            }
        }
        for (let i of Object.entries(schoolData)) {
            if (zipCodes.includes(i[1].zip)) {
                data["school"][i[1].zip] = i[1].total_public_count + i[1].total_private_count;
                data["school"]["max"] = Math.max(data["school"]["max"], i[1].total_public_count + i[1].total_private_count);
            }
        }
        var link = data["link"];
        var bus = data["bus"];
        for (const [key, value] of Object.entries(bus)) {
            if (key in link) {
                data["transportation"][key] = link[key] + value
            } else {
                data["transportation"][key] = value
            }
            data["transportation"]["max"] = Math.max(data["school"]["max"], data["transportation"][key]);
        }

        // get the rank of the dict where the max data has the value zipCodes.length if reverse is false
        function getRankData(dict, reverse) {
            var items = Object.keys(dict).map(function(key) {
                return [key, dict[key]];
              });
            if (reverse) {
                items.sort(function(first, second) {
                    return first[1] - second[1];
                });
            } else {
                items.sort(function(first, second) {
                    return second[1] - first[1];
                });
            }
            var result = {};
            for (let index in items) {
                if (items[index][0] !== "max") {
                    result[items[index][0]] = zipCodes.length - index
                }
            }
            for (let zip of zipCodes) {
                let zipInt = parseInt(zip);
                if (!(zipInt in result)) {
                    result[zipInt] = zipCodes.length / 2
                }
            }
            return result;
        }
        
        var rankData = {};
        rankData["price"] = getRankData(data["price"], true)
        rankData["crime"] = getRankData(data["crime"], true)
        rankData["grocery"] = getRankData(data["grocery"], false)
        rankData["company"] = getRankData(data["company"], false)
        rankData["school"] = getRankData(data["school"], false)
        rankData["transportation"] = getRankData(data["transportation"], false)
        rankData["rest"] = getRankData(data["rest"], false)

        let center = {};
        let projection = d3.geoAlbers().translate([w/3, h/2])
            .scale([120 * w])
            .center([0,47.5])
            .rotate([122.4,0]);
        let path = d3.geoPath().projection(projection);
        let svg = d3.select("#bestZipMap").append("svg").attr("width", w).attr("height", h);

        // set the dimensions and margins of the graph
        var margin = {top: 20, right: 20, bottom: 30, left: w / 2},
            width = w - margin.left - margin.right,
            height = h - margin.top - margin.bottom;

        // set the ranges
        var x = d3.scaleLinear().range([0, width]);
        var y = d3.scaleLinear().range([height, 0]);

        var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);


        let map = svg.selectAll("path").data(zipData.features).enter().append("path")
            .attr("d", path)
            .style("fill", "#D3D3D3")
            .style("stroke", "white")
            .style("stroke-width", 2)
            .attr("id", function(d) {
                let zip = d.properties.ZCTA5CE10;
                center[zip] = path.centroid(d);
                return zip + "bestZip";
            })
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut)
            .on("mousemove", handleMouseMove);
            // # .on("click", handleMouseClick);

        function handleMouseOver() {
            // console.log(this.id);

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
            toolTipG.append("text")
                .style("pointer-events", "none")
                .style("text-align", "center")
                .attr("dy", "1.2em")
                .attr("dx", "6")
                .text(this.id.slice(0, 5));
            if (whetherControl) {
                var scoreForZipcode = scores[this.id.slice(0, 5)];
                toolTipG.append("text")
                .style("pointer-events", "none")
                .style("font-weight", 400)
                .attr("dy", "2.4em")
                .attr("dx", "6")
                .text("Your Match: " + scoreForZipcode + "%");
            }
        }

        function handleMouseOut() {
            // Clean up old tooltips
            d3.select(this).style("opacity", 1);
            svg.selectAll('g.tooltip').remove();
        }

        function handleMouseMove() {
            toolTipText = "" + this.id.slice(0, 5);
            var xPos = d3.mouse(this)[0] - 15;
            var yPos = d3.mouse(this)[1] - 80;
            if (yPos - toolTipHeight < 0) {
                yPos = yPos + 65;
                xPos = xPos + 30;
            }
            toolTipG.attr("transform", "translate(" + xPos +"," + yPos + ")");
        }

        function mapFillFunct(d, given_data) {
            var zipObject = given_data[+d.properties.ZCTA5CE10];
            if (zipObject) {
                return color(zipObject);
            } else {
                return "#D3D3D3";
            }
        }

        function getZipAnaData(zipcode, parameters) {
            var full_parameters = ["price", "crime", "company", "grocery", "school", "transportation", "rest"]
            var diff_parameters = full_parameters.filter(function (a) {
                return parameters.indexOf(a) == -1;
            });
            var result = [];
            for (let index in parameters) {
                var parameter = parameters[index];
                if ((zipcode in data[parameter])) {
                    var temp_dict = {};
                    if (parameter == "rest") {
                        temp_dict["yAxis"] = "restaurant";
                    } else {
                        temp_dict["yAxis"] = parameter;
                    }
                    var value = data[parameter][zipcode];
                    temp_dict["xAxis"] = parseInt(value / data[parameter]["max"] * 100, 10);
                    temp_dict["value"] = value;
                    temp_dict["color"] = gradient[gradient.length - 1 - index];
                    result.unshift(temp_dict)
                }
            }
            for (let parameter of diff_parameters) {
                if ((zipcode in data[parameter])) {
                    var temp_dict = {};
                    if (parameter == "rest") {
                        temp_dict["yAxis"] = "restaurant";
                    } else {
                        temp_dict["yAxis"] = parameter;
                    }
                    var value = data[parameter][zipcode];
                    temp_dict["xAxis"] = parseInt(value / data[parameter]["max"] * 100, 10);
                    temp_dict["value"] = value;
                    temp_dict["color"] = "#2242B4";
                    result.unshift(temp_dict)
                }
            }
            return result;
        }

        function drawZipCodeAnalysis(data_best) {

            var margin = {
                top: 20,
                right: 130,
                bottom: 30,
                left: 130
            },
            width = 500 - margin.left - margin.right,
            height = 200 - margin.top - margin.bottom;
            
            var y = d3.scaleBand()
            .range([height, 0])
            .padding(0.4);
            
            var x = d3.scaleLinear()
            .range([0, width])
            .domain([0, 100]);

            var svg3 = d3.select("#bestZipAnalysis").append("svg")
            .attr("width", 500)
            .attr("height", 200)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
            
            y.domain(data_best.map(function(d) {
            return d.yAxis;
            }));
            
            var backgroundBar = svg3.selectAll(null)
            .data(data_best)
            .enter()
            .append("rect")
            .attr("fill", "lightgray")
            .attr("y", function(d) {
                return y(d.yAxis);
            })
            .attr("height", y.bandwidth())
            .attr("width", function(d) {
                return x(100);
            });
            
            var bar = svg3.selectAll(null)
            .data(data_best)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("fill", function(d) {
                return d.color;
            })
            .attr("y", function(d) {
                return y(d.yAxis);
            })
            .attr("height", y.bandwidth())
            .transition()
            .duration(2000)
            .delay(function(d, i) {
                return i * 100
            })
            .attr("width", function(d) {
                return x(d.xAxis);
            });

            var values = svg3.selectAll(null)
            .data(data_best)
            .enter()
            .append("text")
            .attr("fill", function(d) {
                return d.color;
            })
            .attr("y", function(d) {
                return y(d.yAxis) + y.bandwidth() / 1.2;
            })
            // .attr("x", 10)
            .attr("x", width + 10)
            .text(function(d) {
                if (d.yAxis == "price") {
                    return "$0";
                }
                return 0;
            })
            .transition()
            .duration(2000)
            .delay(function(d, i) {
                return i * 100
            })
            // .attr("x", function(d) {
            //     console.log(x(d.xAxis))
            //     return x(d.xAxis) + 10;
            // })
            .attrTween("text", function(d) {
                var self = this
                var i = d3.interpolateNumber(0, +d.value);
                return function(t) {
                    if (d.yAxis == "price") {
                        return d3.select(self).text("$"+~~i(t));
                    }
                    return d3.select(self).text(~~i(t));
                }
            });
            
            var labels = svg3.selectAll(null)
            .data(data_best)
            .enter()
            .append("text")
            .attr("fill", function(d) {
                return d.color;
            })
            .attr("y", function(d) {
                return y(d.yAxis) + y.bandwidth() / 1.2;
            })
            .attr("x", -10)
            .attr("text-anchor", "end")
            .text(function(d) {
                if (d.yAxis == "transportation") {
                    return "bus/link station";
                }
                return d.yAxis
            });

            svg3.order();
        }

        if (redraw && prevParameters.length > 0) {
            scores = getZipScore(prevParameters);
            d3.select("#bestZipMap").select("svg").selectAll("path").transition().style("fill", function(d) {
                return mapFillFunct(d, scores);
            }).duration(1000);
                    // best zipcode Analysis
            if (whetherControl) {
                var bestZipCode = Object.keys(scores).reduce(function(a, b){ return scores[a] > scores[b] ? a : b });
                if (prevBestZip !== "") {
                    document.getElementById(prevBestZip+"bestZip").style["stroke"] = "white";
                }
                prevBestZip = bestZipCode;
                document.getElementById(bestZipCode+"bestZip").style["stroke"] = "black";
                $('#'+bestZipCode+"bestZip").parent().append($('#'+bestZipCode+"bestZip"));
                if (whetherTextShown) {
                    $("#zipH4").text("Your Best Match District: " + bestZipCode).fadeIn(1000);
                    whetherTextShown = false;
                } else {
                    $("#zipH4").fadeOut(500, function() {
                        $("#zipH4").text("Your Best Match District: " + bestZipCode).fadeIn(500);
                     })
                }
                var data_best = getZipAnaData(bestZipCode, prevParameters);
                d3.select("#bestZipAnalysis").select("svg").remove();
                drawZipCodeAnalysis(data_best);
            }
        }
    }
}

module.exports = bestZip;