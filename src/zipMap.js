class ZipMap {
    constructor() {}

    drawMap() {
        const d3 = require('d3');
        const zipData = require('./zipcode.json');
        const w = 1000;
        const h = 1300;
        let center = {};

        let projection = d3.geoAlbers().translate([w/6, h/2]).scale([100000]).center([0,47.5]).rotate([122.4,0]);
        let path = d3.geoPath().projection(projection);
        let svg = d3.select("#map").append("svg").attr("width", w).attr("height", h);
        let map = svg.selectAll("path").data(zipData.features).enter().append("path")
            .attr("d", path).style("fill", "#D3D3D3").style("stroke", "white")
            .attr("id", function(d) {
                let zip = d.properties.ZCTA5CE10;
                center[zip] = path.centroid(d);
                return zip;
            })
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut)
            .on("click", handleMouseClick);

        function handleMouseOver() {
            d3.select(this).style("opacity", .7);
        }

        function handleMouseOut() {
            d3.select(this).style("opacity", 1);
        }

        let choose = [];

        function handleMouseClick() {
            if (choose.length < 2) {
                d3.select(this).style("fill", "#66CCFF");
                choose.push(this);
            } else {
                alert("Please reset the chosen area")
            }
        }

        let submit = document.getElementById("zipSubmit");
        submit.onclick = function() {
            let zip = document.getElementById("zipChosen").value;
            if (zip in center) {
                svg.append("circle").attr("cx", center[zip][0]).attr("cy", center[zip][1]).attr("r", "100px").style("fill", "transparent").style("stroke", "black");
                svg.append("circle").attr("cx", center[zip][0]).attr("cy", center[zip][1]).attr("r", "5px")
            } else {
                alert("Please enter valid zip code!")
            }

            console.log(center["98105"])
        };

        let reset = document.getElementById("chooseReset");
        reset.onclick = function () {
            d3.select(choose.pop()).style("fill", "D3D3D3");
            d3.select(choose.pop()).style("fill", "D3D3D3");
        };

    }
}

module.exports = ZipMap;