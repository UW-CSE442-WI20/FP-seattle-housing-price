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
        let score = [];

        function handleMouseClick() {
            if (choose.length < 2) {
                let name = ["bus", "company", "crime", "grocery", "price", "link", "restaurant", "school"];
                choose.push(this);
                let yPo = 100;
                if (choose.length === 1) {
                    d3.select(this).style("fill", "#00FFCC");
                    for (let i of Object.entries(data)) {
                        let a = i[1][this.id];
                        if (typeof a == "undefined") {
                            a = 0;
                        }
                        let b = 300*a/i[1]["max"];
                        svg1.append("rect").attr("x", 300-b).attr("y", yPo).attr("height", 20)
                            .attr("width", b).attr("id", "rect").style("fill", "#00FFCC");
                        score.push({xPo1: 300-b-40, yPo: yPo+15, value1: a});
                        yPo += 25;
                    }
                    yPo = 115;
                    for (let i = 0; i < 8; i++) {
                        svg1.append("text").attr("x", 350-name[i].length*4).attr("y", yPo).text(name[i]).attr("id", "name");
                        yPo += 25
                    }
                    svg1.append("text").attr("x", 200).attr("y", 90).text(this.id).attr("id", "rect");
                    d3.selectAll("#name").style("cursor", "pointer").on("click", function(d, i){
                        d3.selectAll("#score").remove();
                        console.log(score)
                        svg1.append("text").attr("x", score[i].xPo1-20).attr("y", score[i].yPo).text(score[i].value1).attr("id", "score");
                        svg1.append("text").attr("x", score[i].xPo2+5).attr("y", score[i].yPo).text(score[i].value2).attr("id", "score");
                    });
                } else {
                    d3.select(this).style("fill", "#66CCFF");
                    let p = 0;
                    for (let i of Object.entries(data)) {
                        let a = i[1][this.id];
                        if (typeof a == "undefined") {
                            a = 0;
                        }
                        let b = 300*a/i[1]["max"];
                        svg1.append("rect").attr("x", 400).attr("y", yPo).attr("height", 20)
                            .attr("width", b).attr("id", "rect").style("fill", "#66CCFF");
                        yPo += 25;
                        score[p]["xPo2"] = 400+b;
                        score[p]["value2"] = a;
                        p++;
                    }
                    svg1.append("text").attr("x", 450).attr("y", 90).text(this.id).attr("id", "rect");
                }
            } else {
                alert("Please reset the chosen area")
            }
        }

        function showScore() {
            console.log("A")
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
            d3.selectAll("#name").remove();
            d3.selectAll("#score").remove();
        };



    }
}

module.exports = ZipMap;