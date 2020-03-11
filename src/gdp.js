class gdp {
    constructor() {}

    drawMap(d3, gdpData) {
        let h = document.documentElement.scrollHeight - 10;
        let w = document.documentElement.scrollWidth;
        let svg = d3.select("#gdpMap").append("svg").attr("width", w).attr("height", h);
        svg.append("text").attr("x", 300).attr("y", 300).text("test");

    }
}

module.exports = gdp;