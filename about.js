let soundtrack;
let inconsolata;
let lastLineHeight = 0;
const LINE_HEIGHT = 28;

function preload() {
    soundtrack = loadSound('assets/SpiegelImSpiegelMonoShort.mp3');
    inconsolata = loadFont('assets/inconsolata.otf');
}


function setup() {
    setupCanvas(false);
    soundtrack.loop();
    cursor(HAND);

}

function draw() {
    lastLineHeight = 0;
    background(255);
    textFont(inconsolata);
    textSize(30);
    fill(0);

    addHeading('ABOUT');
    addParagraph('This breakout game uses 3d, food and stop-motion tricks.');
    addParagraph('It was made from November 2019 to June 2021 in France.');
    addLineBreak();

    addHeading('LOW-TECH');
    addParagraph('The web game is cookieless and databaseless.');
    addParagraph('It was coded and tested on a year 2008 Lenovo T400 laptop.');
    addParagraph('My high-end computer died 2019 in a apple cider accident.');
    addParagraph('No statistics gathered, game state is passed by URL.');
    addParagraph('Cookies shall be eaten like crepes, not just accepted.');
    addLineBreak();

    addHeading('INSPIRATION');
    addParagraph('The beloved Ms. Crepes of Le Mans, a GDevelop teacher;');
    addParagraph('100r.co - The 100 rabbits sailing video games studio;');
    addParagraph('Marjorie Ober & N. Chesnais - Libre Graphics Meeting 2020;');
    addParagraph('L\'Envol by Samuel Yal - an COVID community stop-motion;');
    addParagraph('Emmanuelle Turquet\'s Cuisine Thérapie.');
}

function addLineBreak() {
    lastLineHeight += LINE_HEIGHT;
}


function addHeading(msg) {
    lastLineHeight += LINE_HEIGHT;
    fill(lerp(0,200,mouseX/width));
    text(msg, 10, lastLineHeight);
}

function addParagraph(msg) {
    fill(lerpColor(color(0,255,255), color(255,0,255), (mouseX/width + mouseY/height) / 2.0));
    lastLineHeight += LINE_HEIGHT;
    text(msg, 10, lastLineHeight);
}

function mouseReleased() {
    userStartAudio(); // Chrome hack
    if (mouseX < width && mouseX > 0 && mouseY < height && mouseY > 0) {
        redirectToUrlFor('makingof');
    }
}
