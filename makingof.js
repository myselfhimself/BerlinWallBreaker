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

    addHeading('LOGICIELS');
    addParagraph('p5.js, p5.play, Blender3D, Inkscape, Gimp, Audacity');
    addLineBreak();

    addHeading('NIVEAU 1 - Caen');
    addParagraph('Pommes, céleris, chocolat noir au cornet');
    addLineBreak();

    addHeading('NIVEAU 2 - Le Havre');
    addParagraph('Betteraves, chocolat blanc au cornet');
    addLineBreak();

    addHeading('NIVEAU 3 - Monde');
    addParagraph('Crêpes vegan, chocolat blanc au cornet');
    addLineBreak();

    addHeading('p5 / WEBGL (accueil, transitions)');
    addParagraph('Import OBJ, particules GLSL pixel shader, BLionTaleFont');
    addLineBreak();

    addHeading('MUSIQUE');
    addParagraph('Arvo Pärt, Camille Saint-Saëns, Claude De Bussy');
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
        redirectToUrlFor('home');
    }
}
