console.log("index.js");
const canvas = document.getElementById("gameCanvas");
const g = document.getElementById("gameCanvas").getContext("2d");
console.log(g);

const renderFrame = () => {
    g.fillStyle = 'green';
    g.fillRect(0, 0, canvas.width, canvas.height);
}

window.addEventListener("resize", renderFrame);

renderFrame();