class schoolMap {
    constructor() {}

    drawMap(zipData, schoolData) {
        const d3 = require('d3');
        const w = 1000;
        const h = 1300;

        let data = {"school":{"max":0}};
        for (let i of Object.entries(schoolData)) {
            data["school"][i[1].zip] = i[1].total_public_count + i[1].total_private_count;
            data["school"]["max"] = Math.max(data["school"]["max"], i[1].total_public_count + i[1].total_private_count);
        }

        let center = {};
        let projection = d3.geoAlbers().translate([w/6, h/2.5])
            .scale([50000])
            .center([0,47.5])
            .rotate([122.4,0]);
        let path = d3.geoPath().projection(projection);
        self.svg = d3.select("#mapSchool").append("svg").attr("width", w).attr("height", w);
        // let svg1 = d3.select("#compare").append("svg").attr("width", w).attr("height", h);
        //
        let map = self.svg.selectAll("path").data(zipData.features).enter().append("path")
            .attr("d", path).style("fill", "#D3D3D3").style("stroke", "white")
            .attr("id", function(d) {
                let zip = d.properties.ZCTA5CE10;
                center[zip] = path.centroid(d);
                return zip;
            })
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut);
            // # .on("click", handleMouseClick);

        function handleMouseOver() {
            var toolTipG;
            var toolTipWidth = 150, toolTipHeight = 50;
            d3.select(this).style("opacity", .7);
            // Clean up old tooltips
            self.svg.selectAll('g.tooltip').remove();
            // Append tooltip
            toolTipG = self.svg.append("g").attr('class', 'tooltip');
            var xPos = d3.mouse(this)[0] - 15;
            var yPos = d3.mouse(this)[1] - 55;
            if (yPos - toolTipHeight < 0) {
                yPos = yPos + 65;
                xPos = xPos + 30;
            }
            toolTipG.attr("transform", "translate(" + xPos +"," + yPos + ")");
            var colorKeyWidth = 20, colorKeyHeight = 325, blockHeight = 40;
            var colorKeySVG = self.svg.append("g")
                .on("mouseenter", function() {
                    self.active = true;
                })
                .attr("transform", "translate(10, " + (mapHeight - colorKeyHeight - 10) + ")");
        }

        function handleMouseOut() {
            d3.select(this).style("opacity", 1);
        }

        let choose = [];
        let score = [];

        // function handleMouseClick() {
        //     if (choose.length < 2) {
        //         let name = ["school"];
        //         choose.push(this);
        //         let yPo = 100;
        //         if (choose.length === 1) {
        //             d3.select(this).style("fill", "#00FFCC");
        //             svg1.append("rect").attr("x", 300).attr("y", 95).attr("height", 205).attr("width", 100).attr("id", "rect").style("fill", "F7F7F7");
        //             for (let i of Object.entries(data)) {
        //                 let a = i[1][this.id];
        //                 if (typeof a == "undefined") {
        //                     a = 0;
        //                 }
        //                 let b = 300 * a / i[1]["max"];
        //                 svg1.append("rect").attr("x", 300).attr("y", yPo).attr("height", 20).transition().duration(600)
        //                     .attr("x", 300-b).attr("y", yPo).attr("height", 20).attr("width", b).attr("id", "rect").style("fill", "#00FFCC");
        //                 score.push({xPo1: 300-b, yPo: yPo+15, value1: a});
        //                 yPo += 25;
        //             }
        //             yPo = 115;
        //             for (let i = 0; i < 8; i++) {
        //                 svg1.append("text").attr("x", 350-name[i].length*4).attr("y", yPo).text(name[i]).attr("id", "name");
        //                 yPo += 25
        //             }
        //             svg1.append("text").attr("x", 200).attr("y", 90).text(this.id).attr("id", "rect");
        //         } else {
        //             d3.select(this).style("fill", "#66CCFF");
        //             let p = 0;
        //             for (let i of Object.entries(data)) {
        //                 let a = i[1][this.id];
        //                 if (typeof a == "undefined") {
        //                     a = 0;
        //                 }
        //                 let b = 300 * a / i[1]["max"];
        //                 svg1.append("rect").attr("x", 400).attr("y", yPo).attr("height", 20)
        //                     .transition().duration(600).attr("width", b).attr("id", "rect").style("fill", "#66CCFF");
        //                 yPo += 25;
        //                 score[p]["xPo2"] = 400+b;
        //                 score[p]["value2"] = a;
        //                 p++;
        //             }
        //             svg1.append("text").attr("x", 450).attr("y", 90).text(this.id).attr("id", "rect");
        //             d3.selectAll("#name").style("cursor", "pointer").on("click", function(d, i){
        //                 d3.selectAll("#score").remove();
        //                 svg1.append("text").attr("x", score[i].xPo1-30).attr("y", score[i].yPo).text(score[i].value1).attr("id", "score");
        //                 svg1.append("text").attr("x", score[i].xPo2+5).attr("y", score[i].yPo).text(score[i].value2).attr("id", "score");
        //                 svg1.append("line").attr("x1", score[i].xPo1).attr("y1", 100).attr("x2", score[i].xPo1).attr("y2", 345)
        //                     .style("stroke-dasharray", "2 2").style("stroke", "black").attr("id", "score");
        //                 svg1.append("line").attr("x1", score[i].xPo2).attr("y1", 100).attr("x2", score[i].xPo2).attr("y2", 345)
        //                     .style("stroke-dasharray", "2 2").style("stroke", "black").attr("id", "score");
        //                 svg1.append("text").attr("x", 345).attr("y", 360).text("0").attr("id", "score");
        //                 svg1.append("text").attr("x", score[i].xPo1-20).attr("y", 360).text(score[i].value1).attr("id", "score");
        //                 svg1.append("text").attr("x", score[i].xPo2-20).attr("y", 360).text(score[i].value2).attr("id", "score");
        //                 let x = 15;
        //                 for (let i = 0; i < 50; i++) {
        //                     svg1.append("line").attr("x1", x).attr("y1", 330).attr("x2", x).attr("y2", 345)
        //                         .style("stroke", "black").attr("id", "score");
        //                     x += 15;
        //                 }
        //                 svg1.append("rect").attr("x", score[i].xPo1).attr("y", score[i].yPo-18).attr("height", 3)
        //                     .attr("width", 300-score[i].xPo1).attr("id", "score").style("fill", "#00FFCC");
        //                 svg1.append("rect").attr("x", score[i].xPo1).attr("y", score[i].yPo+5).attr("height", 3)
        //                     .attr("width", 300-score[i].xPo1).attr("id", "score").style("fill", "#00FFCC");
        //                 svg1.append("rect").attr("x", 400).attr("y", score[i].yPo-18).attr("height", 3)
        //                     .attr("width", score[i].xPo2-400).attr("id", "score").style("fill", "#66CCFF");
        //                 svg1.append("rect").attr("x", 400).attr("y", score[i].yPo+5).attr("height", 3)
        //                     .attr("width", score[i].xPo2-400).attr("id", "score").style("fill", "#66CCFF");
        //             });
        //         }
        //     } else {
        //         alert("Please reset the chosen area")
        //     }
        // }
        //
        // let submit = document.getElementById("zipSubmit");
        // submit.onclick = function() {
        //     svg.selectAll("#circle").remove();
        //     let zip = document.getElementById("zipChosen").value;
        //     let dis = document.getElementById("radiusSelect").value;
        //     if (zip in center) {
        //         let arc = d3.arc().innerRadius(dis*35).outerRadius(dis*35);
        //         svg.append("path").attr("fill", "none").attr("stroke", "black").attr("d", arc({startAngle:0, endAngle: 2*Math.PI}))
        //             .attr("transform","translate("+center[zip][0]+","+center[zip][1]+")").attr("id", "circle");
        //         svg.append("circle").attr("cx", center[zip][0]).attr("cy", center[zip][1]).attr("r", "5px").attr("id", "circle");
        //     } else {
        //         alert("Please enter valid zip code!")
        //     }
        // };
        //
        // let reset = document.getElementById("chooseReset");
        // reset.onclick = function () {
        //     score = [];
        //     d3.select(choose.pop()).style("fill", "D3D3D3");
        //     d3.select(choose.pop()).style("fill", "D3D3D3");
        //     d3.selectAll("#rect").remove();
        //     d3.selectAll("#name").remove();
        //     d3.selectAll("#score").remove();
        // };



    }
}

module.exports = schoolMap;