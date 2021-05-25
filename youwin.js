let soundtrack;
let filmReelLoop;
let youWinAnim;

function preload() {
    soundtrack = loadSound('assets/SpiegelImSpiegelMonoShort.mp3');
    filmReelLoop = loadSound('assets/mixkit-explainer-video-foley-projector-hybrid-film-antique-fade-pitch-bend-3012.wav');
    youWinAnim = loadAnimation('sprites/youwin_variants/youwin-01.png', 'sprites/youwin_variants/youwin-08.png');
}

function setup() {
    setupCanvas(false);
    cursor(HAND);
    soundtrack.loop();
    filmReelLoop.loop();
    filmReelLoop.setVolume(0.2);
}

function draw() {
    // Chrome hack
    if (!soundtrack.isPlaying()) {
        soundtrack.loop();
    }
    if (!filmReelLoop.isPlaying()) {
        filmReelLoop.loop();
        filmReelLoop.setVolume(0.2);
    }
    background(255);
    animation(youWinAnim, width / 2, height / 2);
}

function mouseReleased() {
    userStartAudio(); // Chrome hack
    if (mouseX < width && mouseX > 0 && mouseY < height && mouseY > 0) {
        redirectToUrlFor('about');
    }
}
