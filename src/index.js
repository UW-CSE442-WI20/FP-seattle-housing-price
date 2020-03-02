const zipMap = require('./zipMap');
const zipMapInstance = new zipMap();
zipMapInstance.drawMap();
const zipData = zipMapInstance.data;
let btn = document.getElementById("zipSubmit");
btn.onclick = function () {
    const zip = document.getElementById("zipChosen").value;
    if (zip in zipData) {
        alert(zip);
    } else {
        alert("Please enter valid zip code");
    }
};