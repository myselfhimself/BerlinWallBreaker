let soundtrack;
let inconsolata;
let lastLineHeight = 0;
const LINE_HEIGHT = 28;
const Y_CLICK_MARGIN = 2*LINE_HEIGHT;
let ENGLISH_POSITION;
let FRENCH_POSITION;

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

    addLineBreak();
    addLineBreak();
    addLineBreak();
    addLineBreak();
    addLineBreak();

    addHeading('           CHOOSE YOUR LANGUAGE / CHOISIS TA LANGUE');
    addLineBreak();
    addLineBreak();
    addLineBreak();
    addParagraph('                    [   ENGLISH  ]');
    ENGLISH_POSITION = lastLineHeight;
    addLineBreak();
    addLineBreak();
    addLineBreak();
    addParagraph('                    [  FRANCAIS  ]');
    FRENCH_POSITION = lastLineHeight;
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

    if (mouseY > ENGLISH_POSITION - Y_CLICK_MARGIN && mouseY < ENGLISH_POSITION + Y_CLICK_MARGIN) {
        redirectToUrlFor('home', BWB_LANG_EN);
    } else if(mouseY > FRENCH_POSITION - Y_CLICK_MARGIN && mouseY < FRENCH_POSITION + Y_CLICK_MARGIN) {
        redirectToUrlFor('home', BWB_LANG_FR);
    }
}
