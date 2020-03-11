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
                    svg.append("line").attr("x1", w/10).attr("y1", h/4).attr("x2", w/10).attr("y2", h/2).style("stroke", "black");
                    svg.append("line").attr("x1", 9*w/10).attr("y1", h/4).attr("x2", 9*w/10).attr("y2", h/2).style("stroke", "black");
                    let xPo = w / 10;
                    let yPo = {gdp: [], house: []};
                    for (let j of Object.entries(dat)) {
                        yPo.gdp.push(h / 2 - j[1].gdp_per_capita / gdpMax * h / 4);
                        yPo.house.push(h / 2 - j[1].housing / houseMax * h / 4);
                    }
                    for (let j = 0; j < 17; j++) {
                        svg.append("circle").attr("cx", xPo).attr("cy", yPo.gdp[j]).attr("r", w/300).style("fill", "#66CCFF");
                        svg.append("circle").attr("cx", xPo).attr("cy", yPo.house[j]).attr("r", w/300).style("fill", "#00FFCC");
                        if (j !== 16) {
                            svg.append("line").attr("x1", xPo).attr("y1",yPo.gdp[j]).attr("x2", xPo+4/80*w).attr("y2", yPo.gdp[j+1]).style("stroke", "#00FFCC");
                            svg.append("line").attr("x1", xPo).attr("y1",yPo.house[j]).attr("x2", xPo+4/80*w).attr("y2", yPo.house[j+1]).style("stroke", "#66CCFF");
                        }
                        xPo += w/20;
                    }
                    for (let j = 0; j < 6; j++) {
                        svg.append("line").attr("x1", w/10).attr("y1", h/4+j*h/24).attr("x2",9*w/10).attr("y2", h/4+j*h/24).style("stroke-dasharray", "2 2").style("stroke", "black");
                    }
                    xPo = w / 10;
                    for (let j = 0; j < 17; j++) {
                        if (j !== 0 && j !== 16) {
                            svg.append("line").attr("x1", xPo).attr("y1", h/4).attr("x2", xPo).attr("y2", h/2).style("stroke-dasharray", "2 2").style("stroke", "black");
                        }
                        svg.append("text").attr("x", xPo - w/50).attr("y", h/2 + w/50).text(2001+j).style("font-size", w/100);
                        xPo += w/20;
                    }
                    svg.append("circle").attr("cx", 6*w/8-w/80).attr("cy", h/4-h/50).attr("r", w/200).style("fill", "#66CCFF");
                    svg.append("circle").attr("cx", 7*w/8-w/80).attr("cy", h/4-h/50).attr("r", w/200).style("fill", "#00FFCC");
                    svg.append("text").attr("x", 6*w/8).attr("y", h/4-h/50+w/200).text("Housing prices").style("font-size", w/100);
                    svg.append("text").attr("x", 7*w/8).attr("y", h/4-h/50+w/200).text("GDP").style("font-size", w/100);
                }
            }
        }
    }
}

module.exports = gdp;