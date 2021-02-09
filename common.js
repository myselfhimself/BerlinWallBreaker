// CANVAS SETUP
var BWB_WIDTH = 884;
var BWB_HEIGHT = 497;


function centerCanvas() {
    let x = (windowWidth - width) / 2;
    let y = (windowHeight - height) / 2;
    cnv.parent().style.position = "absolute";
    cnv.parent().style.left = x.toString() + "px";
    cnv.parent().style.top = y.toString() + "px";
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


// GAME LOGIC
var BWB_GAME_STATE_LOSE = 0;
var BWB_GAME_STATE_PLAYING = 1;
var BWB_GAME_STATE_WIN = 2;
var BWB_GAME_STATE = BWB_GAME_STATE_PLAYING;

// LEVEL DETECTION AND REDIRECTION FROM URL
var BWB_REDIRECTING = false;
var BWB_LEVEL_ID = location.hash;
var BWB_URL_GAME_OVER = 'level_intro.html#level3';
var BWB_URL_WIN = 'win.html';
var BWB_URL_HOME = 'home.html';

if (BWB_LEVEL_ID == undefined || BWB_LEVEL_ID.indexOf('#level') != 0 || BWB_LEVEL_ID.length != '#level1'.length) {
    console.log('Level is unset, defaulting to 1');
    BWB_LEVEL_ID = 0;
} else {
    BWB_LEVEL_ID = parseInt(BWB_LEVEL_ID.substr('#level'.length, 1));
}

function urlFor(slug) {
    if (slug.indexOf('level') == 0) {
        return 'level.html#level' + slug.substr('level'.length, 1);
    } else if (slug.indexOf('intro') == 0) {
        return 'level_intro.html#level' + slug.substr('intro'.length, 1);
    } else if (slug == 'win') {
        return BWB_URL_WIN;
    } else if (slug == 'home') {
        return BWB_URL_HOME;
    } else if (slug == 'gameover') {
        return BWB_URL_GAME_OVER;
    }
}

function redirectToUrlFor(slug) {
    redirectToUrl(urlFor(slug));
}

function redirectToUrl(url) {
    if (window.location.href != url) {
        window.location.replace(url);
        BWB_REDIRECTING = true;
    }
}

function redirectToGameOver() {
    redirectToUrl(BWB_URL_GAME_OVER);
}
