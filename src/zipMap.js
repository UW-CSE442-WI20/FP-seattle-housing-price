class ZipMap {
    constructor() {}

    drawMap(zipData, busData, companyData, crimeData, groceryData, priceData, linkData, restData, schoolData) {
        const d3 = require('d3');
        const w = 1000;
        const h = 1300;

        let data = {"bus":{"max":0}, "company":{"max":0}, "crime":{"max":0}, "grocery":{"max":0},
            "price":{"max":0}, "link":{"max":0}, "rest":{"max":0}, "school":{"max":0}};
        for (let i of Object.entries(busData)) {
            data["bus"][i[1].zip] = i[1].total_count;
            data["bus"]["max"] = Math.max(data["bus"]["max"], i[1].total_count);
        }
        for (let i of Object.entries(companyData)) {
            data["company"][i[1].zip] = i[1].count_total;
            data["company"]["max"] = Math.max(data["company"]["max"], i[1].count_total);
        }
        for (let i of Object.entries(crimeData)) {
            data["crime"][i[1].zip] = i[1].count_total;
            data["crime"]["max"] = Math.max(data["crime"]["max"], i[1].count_total);
        }
        for (let i of Object.entries(groceryData)) {
            data["grocery"][i[1].zip] = i[1].total_count;
            data["grocery"]["max"] = Math.max(data["grocery"]["max"], i[1].total_count);
        }
        for (let i of Object.entries(priceData)) {
            data["price"][i[0]] = i[1];
            data["price"]["max"] = Math.max(data["price"]["max"], i[1]);
        }
        for (let i of Object.entries(linkData)) {
            data["link"][i[1].zip] = i[1].total_count;
            data["link"]["max"] = Math.max(data["link"]["max"], i[1].total_count);
        }
        for (let i of Object.entries(restData)) {
            data["rest"][i[1].zip] = i[1].total_count;
            data["rest"]["max"] = Math.max(data["rest"]["max"], i[1].total_count);
        }
        for (let i of Object.entries(schoolData)) {
            data["school"][i[1].zip] = i[1].total_public_count + i[1].total_private_count;
            data["school"]["max"] = Math.max(data["school"]["max"], i[1].total_public_count + i[1].total_private_count);
        }

        let center = {};
        let projection = d3.geoAlbers().translate([w/6, h/2.5]).scale([100000]).center([0,47.5]).rotate([122.4,0]);
        let path = d3.geoPath().projection(projection);
        let svg = d3.select("#map").append("svg").attr("width", w).attr("height", h);
        let svg1 = d3.select("#compare").append("svg").attr("width", w).attr("height", h);

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
                choose.push(this);
                let yPo = 100;
                if (choose.length === 2) {
                    d3.select(this).style("fill", "#66CCFF");
                    for (let i of Object.entries(data)) {
                        let a = i[1][this.id];
                        if (typeof a == "undefined") {
                            a = 0;
                        }
                        svg1.append("rect").attr("x", 400).attr("y", yPo).attr("height", 20)
                            .attr("width", 300*a/i[1]["max"]).attr("id", "rect").style("fill", "#66CCFF");
                        yPo += 25;
                    }
                    svg1.append("text").attr("x", 450).attr("y", 90).text(this.id).attr("id", "rect");
                } else {
                    d3.select(this).style("fill", "#00FFCC");
                    for (let i of Object.entries(data)) {
                        let a = i[1][this.id];
                        if (typeof a == "undefined") {
                            a = 0;
                        }
                        let b = 300*a/i[1]["max"];
                        svg1.append("rect").attr("x", 300-b).attr("y", yPo).attr("height", 20)
                            .attr("width", b).attr("id", "rect").style("fill", "#00FFCC");
                        yPo += 25;
                    }
                    svg1.append("text").attr("x", 200).attr("y", 90).text(this.id).attr("id", "rect");
                    svg1.append("text").attr("x", 335).attr("y", 115).text("bus").attr("id", "rect");
                    svg1.append("text").attr("x", 318).attr("y", 140).text("company").attr("id", "rect");
                    svg1.append("text").attr("x", 328).attr("y", 165).text("crime").attr("id", "rect");
                    svg1.append("text").attr("x", 323).attr("y", 190).text("grocery").attr("id", "rect");
                    svg1.append("text").attr("x", 331).attr("y", 215).text("price").attr("id", "rect");
                    svg1.append("text").attr("x", 333).attr("y", 240).text("link").attr("id", "rect");
                    svg1.append("text").attr("x", 313).attr("y", 265).text("restaurant").attr("id", "rect");
                    svg1.append("text").attr("x", 327).attr("y", 290).text("school").attr("id", "rect");
                }
            } else {
                alert("Please reset the chosen area")
            }
        }

        let submit = document.getElementById("zipSubmit");
        submit.onclick = function() {
            svg.selectAll("#circle").remove();
            let zip = document.getElementById("zipChosen").value;
            let dis = document.getElementById("radiusSelect").value;
            if (zip in center) {
                svg.append("circle").attr("cx", center[zip][0]).attr("cy", center[zip][1])
                    .attr("r", dis*35).style("fill", "transparent").style("stroke", "black").attr("id", "circle");
                svg.append("circle").attr("cx", center[zip][0]).attr("cy", center[zip][1]).attr("r", "5px").attr("id", "circle");
            } else {
                alert("Please enter valid zip code!")
            }
        };

        let reset = document.getElementById("chooseReset");
        reset.onclick = function () {
            d3.select(choose.pop()).style("fill", "D3D3D3");
            d3.select(choose.pop()).style("fill", "D3D3D3");
            d3.selectAll("#rect").remove();
        };



    }
}

module.exports = ZipMap;