BWB_DEBUG = false; // Export mode

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

function setupCanvas(withWebGL /*default: true*/) {
    withWebGL = withWebGL == undefined ? true : withWebGL;
    withWebGL = withWebGL ? WEBGL : P2D;
    cnv = createCanvas(BWB_WIDTH, BWB_HEIGHT, withWebGL);
    cnv.parent('gameScreen');
    centerCanvas();
}


// GAME LOGIC
var BWB_GAME_STATE_LOSE = 0;
var BWB_GAME_STATE_PLAYING = 1;
var BWB_GAME_STATE_WIN = 2;
var BWB_GAME_STATE_PAUSED = 3;
var BWB_GAME_STATE = BWB_GAME_STATE_PLAYING;
var BWB_DEFAULT_GAME_LIVES = 3;
var BWB_GAME_LIVES = BWB_DEFAULT_GAME_LIVES;
var BWB_DEFAULT_LEVEL_ID = 0;

// LEVEL AND LIVES COUNT DETECTION AND REDIRECTION FROM URL
// anchor must be like: #levelNlivesM (if provided), defaults to #level0lives3 (ie. level 1, 3 lives)
var BWB_REDIRECTING = false;
var BWB_LEVEL_KEYWORD = 'level'; //  levelN: current (or target level)
var BWB_LIVES_KEYWORD = 'lives'; // livesN: remaining lives
var BWB_LEVEL_ID = BWB_DEFAULT_LEVEL_ID; // Integer
var BWB_LEVEL_URL_DATA = location.hash; // Default BWB_LEVEL_ID is full hash. Will be just an integer after then.

if (BWB_LEVEL_URL_DATA == undefined || BWB_LEVEL_URL_DATA.indexOf('#' + BWB_LEVEL_KEYWORD) != 0 || BWB_LEVEL_URL_DATA.length < ('#' + BWB_LEVEL_KEYWORD).length+1) {
    console.log('Level is unset, defaulting to 1');
    BWB_LEVEL_ID = 0;
} else {
    BWB_LEVEL_ID = parseInt(BWB_LEVEL_URL_DATA.substr(('#' + BWB_LEVEL_KEYWORD).length, 1));
    console.log('Level is set: ' + BWB_LEVEL_ID.toString());
}
if (BWB_LEVEL_URL_DATA == undefined || BWB_LEVEL_URL_DATA.indexOf(BWB_LIVES_KEYWORD) == -1) {
    //BWB_GAME_LIVES = BWB_GAME_LIVES;
    console.log('Lives is unset, defaulting to ' + BWB_GAME_LIVES.toString());
} else {
    BWB_GAME_LIVES = parseInt(BWB_LEVEL_URL_DATA.substr(('#' + BWB_LEVEL_KEYWORD + 'N' + BWB_LIVES_KEYWORD).length, 1));
    console.log('Lives is set: ' + BWB_GAME_LIVES.toString());
}
// END OF LEVEL AND LIVES COUNT DETECTION

var BWB_URL_GAME_OVER = 'level_intro.html#level3';
var BWB_URL_WIN = 'youwin.html';
var BWB_URL_HOME = 'home.html';
var BWB_URL_MAKING_OF = 'makingof.html';


// TODO GAME OVER PARAMETERS PASSING (level + lives)
// TODO GAME OVER TO TRY AGAIN TEXT AS LONG AS LIVES ARE NOT FINISHED

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
    } else if (slug == 'makingof') {
        return BWB_URL_MAKING_OF;
    }
}

function redirectToUrlFor(slug) {
    redirectToUrl(urlFor(slug));
}

function redirectToUrl(url) {
    if (!BWB_REDIRECTING) {
        BWB_REDIRECTING = true;
        if(window.location.href != url) {
            setTimeout(function(){
                window.location.href = url;
            }, 1500);
            //window.location.href = url;
        }
    }
}

function redirectToGameOver() {
    redirectToUrl(BWB_URL_GAME_OVER);
}
