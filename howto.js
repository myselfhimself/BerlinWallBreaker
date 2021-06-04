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

    if(BWB_LANG == BWB_LANG_EN) {
        addHeading('YOUR MISSION');
        addLineBreak();
        addParagraph('DISCOVER NORMANDY AND BREAK WALLS !!!');
        addLineBreak();
        addLineBreak();
        addLineBreak();

        addHeading('HOW TO PLAY?');
        addLineBreak();
        addParagraph('GO TO NEXT STEP    click or tap screen            /\\');
        addParagraph('MOVE PADDLE        move mouse or tap screen      << >>');
        addParagraph('PAUSE/RESUME       escape                        [ESC]');

        addLineBreak();
        addLineBreak();
        addLineBreak();
        addHeading('           <<<< CLICK/TAP ANYWHERE >>>>');
    } else {
        addHeading('TON DEFI');
        addLineBreak();
        addParagraph('DÉCOUVRE LA NORMANDIE EN CASSANT DES MURS DE NOURRITURE!!!');
        addLineBreak();                                                        
        addLineBreak();                                                        
        addLineBreak();                                                        
                                                                                   
        addHeading('COMMENT JOUER ?');                                            
        addLineBreak();
        addParagraph('ETAPE SUIVANTE   clique/touche l\'écran               /\\');
        addParagraph('DEPLACER PALETTE bouge la souris/toucher l\'écran    << >>');
        addParagraph('PAUSE/REPRISE    appuye sur Echap                   [ESC]');    

        addLineBreak();
        addLineBreak();
        addLineBreak();
        addHeading('      <<<< CLIQUE/TOUCHE L\'ECRAN POUR LA SUITE >>>>');
    }

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
        redirectToUrlFor('intro0');
    }
}
