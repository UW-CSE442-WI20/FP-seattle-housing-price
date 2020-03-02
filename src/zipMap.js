class ZipMap {
    constructor() {
    }
    drawMap() {
        const zipData = require('./zipcode.json');
        let dat = {};
        for (let i = 0; i < zipData["features"].length; i++) {
            dat[zipData["features"][i]["properties"]["ZCTA5CE10"]] = zipData["features"][i]["geometry"]["coordinates"]
        }
        const d3 = require('d3');
        let svg = d3.select("svg").append("g");
        for (let zipCode in dat) {
            let coor = dat[zipCode][0];
            for (let i = 0; i < coor.length - 1; i++) {
                svg.append("line").style("stroke", "green").style("stroke-width", 1).attr("x1", (coor[i][0]+123)*1000-500).attr("y1", (48-coor[i][1])*1000)
                    .attr("x2", (coor[i+1][0]+123)*1000-500).attr("y2", (48-coor[i+1][1])*1000);
            }
        }
    }
}

module.exports = ZipMap;