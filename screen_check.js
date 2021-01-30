var REDIRECTING=false;
var nextUrl = 'comingsoon.html';
var b;
function setup() {
	createCanvas(windowWidth, windowHeight);
	b = createButton("C'est bon");
	b.position(10,100);
	b.mousePressed(redirect);
	b.hide();
}

function redirect() {
  if(!REDIRECTING) {
     if(window.location.href != nextUrl) {
       window.location.replace(nextUrl);
       REDIRECTING = true;
     }
  }
}

function draw() {
  background(0);
  if(windowHeight > windowWidth || deviceOrientation == PORTRAIT) {
    textSize(30);
    fill(120);
    text("Tourne l'écran",10,30)
    text("en format paysage :)",10,70)
    b.show();
  } else {
    redirect();
  }
}
