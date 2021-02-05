var BWB_WIDTH = 884;
var BWB_HEIGHT = 497;

function centerCanvas() {
  let x = (windowWidth - width) / 2;
  let y = (windowHeight - height) / 2;
  cnv.parent().style.position = "absolute";
  cnv.parent().style.left = x.toString()+"px";
  cnv.parent().style.top = y.toString()+"px";
  cnv.parent().style.border = "3px lightsteelblue solid";
}

function windowResized() {
  centerCanvas();
}

function setupCanvas() {
  cnv = createCanvas(BWB_WIDTH, BWB_HEIGHT, WEBGL);
  cnv.parent('gameScreen');
  centerCanvas();
}

