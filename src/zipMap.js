class ZipMap {
    constructor() {
        this.data = {};
        const zipData = require('./zipcode.json');
        for (let i = 0; i < zipData["features"].length; i++) {
            this.data[zipData["features"][i]["properties"]["ZCTA5CE10"]] = zipData["features"][i]["geometry"]["coordinates"]
        }
    }
    drawMap() {
        const d3 = require('d3');
        const zipData = require('./zipcode.json');

        const w = 1000;
        const h = 1300;

        let projection = d3.geoAlbers()
            .translate([w/6, h/2])
            .scale([100000])
            .center([0,47.5])
            .rotate([122.4,0]);

        let path = d3.geoPath()
            .projection(projection);

        let svg = d3.select("#map")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

        let map = svg.selectAll("path")
            .data(zipData.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("class", "district");
    }
}

module.exports = ZipMap;