class gdp {
    constructor() {}

    drawMap(d3, gdpData) {
        let h = document.documentElement.scrollHeight - 10;
        let w = document.documentElement.scrollWidth;

        let city = document.getElementById("citySelect");
        city.addEventListener("change", draw);
        draw();

        function draw() {
            d3.select("#gdpsvg").remove();
            let svg = d3.select("#gdpMap").append("svg").attr("width", w).attr("height", h).attr("id", "gdpsvg");
            for (let i = 0; i < 4; i++) {
                if (gdpData[i].name === city.value) {
                    let dat = gdpData[i].data;
                    let gdpMax = 0;
                    let houseMax = 0;
                    for (let j of Object.entries(dat)) {
                        gdpMax = Math.max(gdpMax, j[1].gdp_per_capita);
                        houseMax = Math.max(houseMax, j[1].housing);
                    }
                    svg.append("line").attr("x1", w/10).attr("y1", h/2).attr("x2", 9*w/10).attr("y2", h/2).style("stroke", "black");
                    svg.append("line").attr("x1", w/10).attr("y1", h/6).attr("x2", w/10).attr("y2", h/2).style("stroke", "black");
                    svg.append("line").attr("x1", 9*w/10).attr("y1", h/6).attr("x2", 9*w/10).attr("y2", h/2).style("stroke", "black");
                    let xPo = w / 10;
                    let yPo = {gdp: [], house: []};
                    for (let j of Object.entries(dat)) {
                        yPo.gdp.push(h/2 - j[1].gdp_per_capita/gdpMax*h/3);
                        yPo.house.push(h/2 - j[1].housing/houseMax*h/3);
                    }
                    for (let j = 0; j < 17; j++) {
                        svg.append("circle").attr("cx", xPo).attr("cy", yPo.gdp[j]).transition().delay(80*j).duration(1).attr("r", w/300).style("fill", "#00FFCC");
                        svg.append("circle").attr("cx", xPo).attr("cy", yPo.house[j]).transition().delay(80*j).duration(1).attr("r", w/300).style("fill", "#66CCFF");
                        if (j !== 16) {
                            svg.append("line").attr("x1", xPo).attr("y1",yPo.gdp[j]).attr("x2", xPo+4/80*w).attr("y2", yPo.gdp[j+1]).transition().delay(80*j).style("stroke", "#00FFCC");
                            svg.append("line").attr("x1", xPo).attr("y1",yPo.house[j]).attr("x2", xPo+4/80*w).attr("y2", yPo.house[j+1]).transition().delay(80*j).style("stroke", "#66CCFF");
                        }
                        xPo += w/20;
                    }

                    svg.selectAll("circle").on("mouseover", handleMouse).on("mouseout", handleMouseOut);

                    function handleMouse(d, i) {
                        let coor = d3.mouse(this);
                        let width = [];
                        let words = [];
                        if (i % 2 === 0) {
                            let year = 2001 + i/2;
                            words.push("Year: " + year);
                            words.push("GDP: $" + dat[year].gdp_per_capita);
                        } else {
                            let year = 2001 + (i-1)/2;
                            words.push("Year: " + year);
                            words.push("Housing price: $" + dat[year].housing);
                        }
                        svg.append('g').selectAll('.dummy').data(words).enter().append("text").text(function(d) {return d})
                            .style("font-size", w/150).each(function() {
                            let thisWidth = this.getComputedTextLength();
                            width.push(thisWidth);
                            this.remove()});
                        svg.append("rect").attr("x", coor[0]+w/200).attr("y", coor[1]+h/200).attr("width", width[1]+w/100).attr("height", h/20)
                            .attr("id", "gdphover").style("fill", "F7F7F7");
                        svg.append("text").attr("x", coor[0]+w/100).attr("y", coor[1]+h/40).text(words[0]).style("font-size", w/150).attr("id", "gdphover");
                        svg.append("text").attr("x", coor[0]+w/100).attr("y", coor[1]+h/22).text(words[1]).style("font-size", w/150).attr("id", "gdphover");
                    }

                    function handleMouseOut() {
                        d3.selectAll("#gdphover").remove();
                    }

                    for (let j = 0; j < 6; j++) {
                        svg.append("line").attr("x1", w/10).attr("y1", h/6+j*h/18).attr("x2",9*w/10).attr("y2", h/6+j*h/18).style("stroke-dasharray", "2 2").style("stroke", "black");
                    }
                    xPo = w / 10;
                    for (let j = 0; j < 17; j++) {
                        if (j !== 0 && j !== 16) {
                            svg.append("line").attr("x1", xPo).attr("y1", h/6).attr("x2", xPo).attr("y2", h/2).style("stroke-dasharray", "2 2").style("stroke", "black");
                        }
                        svg.append("text").attr("x", xPo-w/80).attr("y", h/2+h/50).text(2001+j).style("font-size", w/100);
                        xPo += w/20;
                    }
                    svg.append("circle").attr("cx", 6.3*w/8-w/80).attr("cy", h/6-h/25).attr("r", w/500).style("fill", "#66CCFF");
                    svg.append("circle").attr("cx", 7*w/8-w/80).attr("cy", h/6-h/25).attr("r", w/500).style("fill", "#00FFCC");
                    svg.append("text").attr("x", 6.3*w/8).attr("y", h/6-h/30).text("Housing prices").style("font-size", w/120);
                    svg.append("text").attr("x", 7*w/8).attr("y", h/6-h/30).text("GDP").style("font-size", w/120);
                }
            }
        }

    }
}

module.exports = gdp;