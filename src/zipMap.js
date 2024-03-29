class ZipMap {
    constructor() {}

    drawMap(d3, zipData, busData, companyData, crimeData, groceryData, priceData, linkData, restData, schoolData) {
        let h = document.documentElement.scrollHeight - 10;
        let w1 = document.documentElement.scrollWidth * 3 / 10;
        let w = document.documentElement.scrollWidth * 7 / 10;

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
        let projection = d3.geoAlbers().translate([w1/6, 2*h/3]).scale([200*w1]).center([0,47.5]).rotate([122.4,0]);
        let path = d3.geoPath().projection(projection);
        let svg = d3.select("#map").append("svg").attr("width", w1).attr("height", h);
        let svg1 = d3.select("#compare").append("svg").attr("width", w).attr("height", h);
        

        let map = svg.selectAll("path").data(zipData.features).enter().append("path")
            .attr("d", path).style("fill", "#D3D3D3").style("stroke", "white")
            .style("stroke-width", 2)
            .attr("id", function(d) {
                let zip = d.properties.ZCTA5CE10;
                center[zip] = path.centroid(d);
                return zip;
            })
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut)
            .on("mousemove", handleMouseMove)
            .on("click", handleMouseClick);

        var toolTipG;
        var toolTipWidth = 57, toolTipHeight = 50;

        function handleMouseOver() {
            d3.select(this).style("opacity", .7);
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
                .attr("dy", "2em")
                .attr("dx", "6")
                .text(this.id.slice(0, 5));
        }

        function handleMouseOut() {
            d3.select(this).style("opacity", 1);
            svg.selectAll('g.tooltip').remove();
        }

        function handleMouseMove() {
            var toolTipText = this.id;
            var xPos = d3.mouse(this)[0] - 15;
            var yPos = d3.mouse(this)[1] - 80;
            if (yPos - toolTipHeight < 0) {
                yPos = yPos + 65;
                xPos = xPos + 30;
            }
            toolTipG.attr("transform", "translate(" + xPos +"," + yPos + ")");
        }

        let choose = [];
        let score = [];

        function handleMouseClick() {
            if ((choose.length < 2 || typeof choose[0] == "undefined") && choose[0] !== this && choose[1] !== this) {
                let name = ["bus", "company", "crime", "grocery", "price", "link", "restaurant", "school"];
                let b = 0;
                if (choose.length < 2) {
                    choose.push(this);
                } else {
                    choose[0] = this;
                    b = 1;
                }
                let yPo = h/10;
                if (choose.length === 1 || b === 1) {
                    d3.select(this).style("fill", "#3995FC");
                    svg1.append("rect").attr("x", 3*w/10).attr("y", yPo).attr("height", h/5).attr("width", w/15).attr("id", "name").style("fill", "F7F7F7");

                    let dat = [];
                    for (let i of Object.entries(data)) {
                        let a = i[1][this.id];
                        if (typeof a == "undefined") {
                            a = 0;
                        }
                        dat.push(a);
                    }
                    let datWidth = [];
                    svg.append('g').selectAll('.dummyDat').data(dat).enter().append("text").text(function(d) {return d})
                        .attr("font-size", w/90).each(function() {
                        let thisWidth = this.getComputedTextLength();
                        datWidth.push(thisWidth);
                        this.remove()});
                    let j = 0;
                    for (let i of Object.entries(data)) {
                        let a = i[1][this.id];
                        if (typeof a == "undefined") {
                            a = 0;
                        }
                        let b = w/5 * a/i[1]["max"];
                        if (b === 0) {
                            svg1.append("rect").attr("x", 3*w/10).attr("y", yPo).attr("height", h/50).transition().duration(600)
                                .attr("x", 3*w/10-1).attr("y", yPo).attr("height", h/50).attr("width", 1).attr("id", "rect1").style("fill", "black");
                        } else {
                            svg1.append("rect").attr("x", 3*w/10).attr("y", yPo).attr("height", h/50).transition().duration(600)
                                .attr("x", 3*w/10-b).attr("y", yPo).attr("height", h/50).attr("width", b).attr("id", "rect1").style("fill", "#3995FC");
                        }
                        svg1.append("text").attr("x", 3*w/10-b-datWidth[j]-w/200).attr("y", yPo+h/60).transition().delay(300).duration(1).text(a).attr("id", "rect1").attr("font-size", w/90);
                        score.push({xPo1: 3*w/10-b-a.toString().length*12, yPo: yPo+h/60, value1: a});
                        yPo += h/40;
                        j++;
                    }
                    yPo = h/10+h/70;

                    let textWidth = [];
                    svg.append('g').selectAll('.dummyText').data(name).enter().append("text").text(function(d) {return d})
                        .attr("font-size", w/90).each(function() {
                            let thisWidth = this.getComputedTextLength();
                            textWidth.push(thisWidth);
                            this.remove()});
                    for (let i = 0; i < 8; i++) {
                        svg1.append("text").attr("x", w/3-textWidth[i]/2).attr("y", yPo).text(name[i]).attr("id", "name").attr("font-size", w/90);
                        yPo += h/40;
                    }
                    svg1.append("text").attr("x", w/5).attr("y", h/10-h/70).text(this.id).attr("id", "rect1").attr("font-size", w/90);
                } else {
                    d3.select(this).style("fill", "#C382F9");
                    let p = 0;
                    for (let i of Object.entries(data)) {
                        let a = i[1][this.id];
                        if (typeof a == "undefined") {
                            a = 0;
                        }
                        let b = w/5 * a/i[1]["max"];
                        if (b === 0) {
                            svg1.append("rect").attr("x", 11*w/30).attr("y", yPo).attr("height", h/50)
                                .transition().duration(600).attr("width", 1).attr("id", "rect2").style("fill", "black");
                        } else {
                            svg1.append("rect").attr("x", 11*w/30).attr("y", yPo).attr("height", h/50)
                                .transition().duration(600).attr("width", b).attr("id", "rect2").style("fill", "#C382F9");
                        }
                        svg1.append("text").attr("x", 11*w/30+b+w/200).attr("y", yPo+h/60).transition().delay(300).duration(1).text(a).attr("id", "rect2").attr("font-size", w/90);
                        yPo += h/40;
                        score[p]["xPo2"] = 11*w/30+b+w/200;
                        score[p]["value2"] = a;
                        p++;
                    }
                    yPo += h/40;
                    // for (let i = 0; i < 8; i++) {
                    //     if (score[i].value1 > score[i].value2) {
                    //         svg1.append("text").attr("x", w/10).attr("y", yPo).text(choose[0].id + " has more " + name[i] + " than " + choose[1].id).attr("id", "rect").attr("font-size", w/90);
                    //     } else if (score[i].value1 < score[i].value2) {
                    //         svg1.append("text").attr("x", w/10).attr("y", yPo).text(choose[0].id + " has less " + name[i] + " than " + choose[1].id).attr("id", "rect").attr("font-size", w/90);
                    //     } else {
                    //         svg1.append("text").attr("x", w/10).attr("y", yPo).text(choose[0].id + " has equal " + name[i] + " as " + choose[1].id).attr("id", "rect").attr("font-size", w/90);
                    //     }
                    //     yPo += h/40;
                    // }
                    svg1.append("text").attr("x", w/2.2).attr("y", h/10-h/70).text(this.id).attr("id", "rect2").attr("font-size", w/90);
                    // d3.selectAll("#name").style("cursor", "pointer").on("click", function(d, i){
                    //     d3.selectAll("#score").remove();
                    //     svg1.append("text").attr("x", score[i].xPo1-30).attr("y", score[i].yPo).text(score[i].value1).attr("id", "score");
                    //     svg1.append("text").attr("x", score[i].xPo2+5).attr("y", score[i].yPo).text(score[i].value2).attr("id", "score");
                    //     svg1.append("line").attr("x1", score[i].xPo1).attr("y1", 100).attr("x2", score[i].xPo1).attr("y2", 345)
                    //         .style("stroke-dasharray", "2 2").style("stroke", "black").attr("id", "score");
                    //     svg1.append("line").attr("x1", score[i].xPo2).attr("y1", 100).attr("x2", score[i].xPo2).attr("y2", 345)
                    //         .style("stroke-dasharray", "2 2").style("stroke", "black").attr("id", "score");
                    //     svg1.append("text").attr("x", 345).attr("y", 360).text("0").attr("id", "score");
                    //     svg1.append("text").attr("x", score[i].xPo1-20).attr("y", 360).text(score[i].value1).attr("id", "score");
                    //     svg1.append("text").attr("x", score[i].xPo2-20).attr("y", 360).text(score[i].value2).attr("id", "score");
                    //     let x = 15;
                    //     for (let i = 0; i < 50; i++) {
                    //         svg1.append("line").attr("x1", x).attr("y1", 330).attr("x2", x).attr("y2", 345)
                    //             .style("stroke", "black").attr("id", "score");
                    //         x += 15;
                    //     }
                    //     svg1.append("rect").attr("x", score[i].xPo1).attr("y", score[i].yPo-18).attr("height", 3)
                    //         .attr("width", 300-score[i].xPo1).attr("id", "score").style("fill", "#00FFCC");
                    //     svg1.append("rect").attr("x", score[i].xPo1).attr("y", score[i].yPo+5).attr("height", 3)
                    //         .attr("width", 300-score[i].xPo1).attr("id", "score").style("fill", "#00FFCC");
                    //     svg1.append("rect").attr("x", 400).attr("y", score[i].yPo-18).attr("height", 3)
                    //         .attr("width", score[i].xPo2-400).attr("id", "score").style("fill", "#66CCFF");
                    //     svg1.append("rect").attr("x", 400).attr("y", score[i].yPo+5).attr("height", 3)
                    //         .attr("width", score[i].xPo2-400).attr("id", "score").style("fill", "#66CCFF");
                    // });
                }
            } else if (typeof choose[0] != "undefined" && this.id === choose[0].id) {
                d3.select(this).style("fill", "#D3D3D3");
                d3.selectAll("#rect1").remove();
                if (choose.length === 2) {
                    let sec = choose.pop();
                    choose = [];
                    choose[1] = sec;
                } else {
                    choose.pop();
                }
                if (choose.length === 0) {
                    d3.selectAll("#name").remove();
                }
            } else if (typeof choose[1] != "undefined" && this.id === choose[1].id) {
                d3.select(this).style("fill", "#D3D3D3");
                d3.selectAll("#rect2").remove();
                choose.pop();
                if (typeof choose[0] == "undefined") {
                    choose.pop();
                }
                if (choose.length === 0) {
                    d3.selectAll("#name").remove();
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
                let arc = d3.arc().innerRadius(dis*w1/15).outerRadius(dis*w1/15);
                let a = d3.arc().innerRadius(1).outerRadius(1);
                svg.append("path").attr("transform","translate("+center[zip][0]+","+center[zip][1]+")")
                    .attr("d", a({startAngle:0, endAngle: 2*Math.PI})).transition().duration(600)
                    .attr("d", arc({startAngle:0, endAngle: 2*Math.PI}))
                    .attr("fill", "none").attr("stroke", "black").attr("id", "circle");
                svg.append("circle").attr("cx", center[zip][0]).attr("cy", center[zip][1]).attr("r", w1/200).attr("id", "circle");
            } else {
                alert("Please enter valid zip code!")
            }
        };

        let reset = document.getElementById("chooseReset");
        reset.onclick = function () {
            score = [];
            d3.select(choose.pop()).style("fill", "D3D3D3");
            d3.select(choose.pop()).style("fill", "D3D3D3");
            d3.selectAll("#rect1").remove();
            d3.selectAll("#rect2").remove();
            d3.selectAll("#name").remove();
            d3.selectAll("#score").remove();
            d3.selectAll("#circle").remove();
        };



    }
}

module.exports = ZipMap;
