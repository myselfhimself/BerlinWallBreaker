// Inspired from https://discourse.processing.org/t/fragment-shader-too-many-uniforms-error/17603/13
// POC'ed at https://editor.p5js.org/myselfhimself/sketches/mwEIYrOWO

var whiteColor = function () {
    return color(255, 255, 255);
};
var LEVEL_LANG_KEYWORD = BWB_LANG == BWB_LANG_FR ? "NIVEAU" : "LEVEL";
var LEVEL_GAME_OVER_KEYWORDS = BWB_LANG == BWB_LANG_FR ? ["T'AS", "PERDU"] : ["GAME", "OVER"];
var LEVEL_TRY_AGAIN_KEYWORDS = BWB_LANG == BWB_LANG_FR ? ["ESSAIE", "ENCORE"] : ["TRY", "AGAIN"];

function level_title(levelNumber) {
    return LEVEL_LANG_KEYWORD + levelNumber.toString();
}

LEVELS_DATA = [
    // #0 - LEVEL 0
    {
        colorFunc: whiteColor,
        text: [level_title(1), "CAEN"],
        paddingLeftDivider: 5,
        nextUrlSlug: "level0",
    },
    // #1 - LEVEL 2
    {
        colorFunc: whiteColor,
        text: [level_title(2), "LEHAVRE"],
        paddingLeftDivider: 5,
        nextUrlSlug: "level1",
    },
    // #2 - LEVEL 3
    {
        colorFunc: whiteColor,
        text: [level_title(3), BWB_LANG == BWB_LANG_FR ? "MONDE" : "WORLD"],
        paddingLeftDivider: 5,
        nextUrlSlug: "level2",
    },
    // #3 - GAME OVER (LIVES==0) // TRY AGAIN (LIVES>0)
    {
        colorFunc: function () {
            return color(random(255), random(255), random(255));
        },
	text: BWB_GAME_LIVES == 0 ? LEVEL_GAME_OVER_KEYWORDS : LEVEL_TRY_AGAIN_KEYWORDS,
        paddingLeftDivider: 2,
        nextUrlSlug: BWB_GAME_LIVES == 0 ? "home" : "level" + BWB_LEVEL_ID.toString(),
    },
    // #4 - YOU WIN
    {
        colorFunc: function () {
            return color(random(255), random(255), random(255));
        },
        text: ["YOU", "WIN"],
        paddingLeftDivider: 2,
        nextUrlSlug: "home",
    },

];
// NO LIVES LEFT OR JUST LOST ONE LIFE? USE THE GAME OVER LEVEL DATA INSTEAD! OTHERWISE USE THE CURRENT LEVEL'S DATA.
let LEVEL_DATA_ID = BWB_GAME_LIVES == 0 || BWB_LEVEL_URL_DATA.indexOf('lost') != -1 ? 3 : BWB_LEVEL_ID;
console.log(LEVELS_DATA[LEVEL_DATA_ID]);

let img;
let fx;
let NUM_PARTICLES;
let particle_coords = [];
let maxBri;

let points;

let EXPLODED = false;
let EXPLODE_START_T = 0;

let soundtrack, explosion_sound, noise_sound;

function preload() {

    font = loadFont('assets/inconsolata.otf');
    soundtrack = loadSound('assets/SilentiumMonoShort.mp3');
    explosion_sound = loadSound('assets/cold-explosion-fx.wav');
    noise_sound = loadSound('assets/vinyl-noises_121bpm_G_major.wav');

}

function setup() {
    BWB_WIDTH = BWB_HEIGHT = 300;
    setupCanvas();
    cursor(HAND);
    soundtrack.play();

    points = font.textToPoints(LEVELS_DATA[LEVEL_DATA_ID].text[0], width / (LEVELS_DATA[LEVEL_DATA_ID].text[1].length * LEVELS_DATA[LEVEL_DATA_ID].paddingLeftDivider), height / 2, 70, {
        sampleFactor: 0.1,
        simplifyThreshold: 0
    });
    points = points.concat(font.textToPoints(LEVELS_DATA[LEVEL_DATA_ID].text[1], width / (LEVELS_DATA[LEVEL_DATA_ID].text[1].length * LEVELS_DATA[LEVEL_DATA_ID].paddingLeftDivider), height / 2 + 70, 70, {
        sampleFactor: 0.1,
        simplifyThreshold: 0
    }));

    NUM_PARTICLES = points.length;

    for (let i = 0; i < NUM_PARTICLES; i++) {
        // x,y,yspeed,random intial offset for use in x and/or ylocate
        particle_coords.push([points[i].x, height - points[i].y, 3, random(300)]);
    }

    fx = createShader(`
    precision highp float; 
    attribute vec3 aPosition;
    void main() { 
      gl_Position = vec4(aPosition, 1.0); 
    }`, `
    precision highp float;
    uniform sampler2D tex;
    uniform float maxBri;
    uniform vec3 color;
    void main() {
      float bri = 0.0;
      //float maxBri = 0.0008; // adjust depending on the number of particles
      vec2 pos = gl_FragCoord.xy / 300.0;
      for(float x=0.0; x<1.0; x+=1.0/${NUM_PARTICLES}.) {
        vec4 data = texture2D(tex, vec2(x, 0.0));
        bri += maxBri / distance(pos, data.xy);
      }
      gl_FragColor = vec4(vec3(color)*bri, 1.0);
    }`);
    noStroke();
    shader(fx);

    img = createImage(NUM_PARTICLES, 1);
}

function mouseClicked() {
    if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) {
        return;
    }
    if (!EXPLODED) {
        EXPLODED = true;
        EXPLODE_START_T = millis();
        explosion_sound.play();
    } else if (millis() - EXPLODE_START_T > 1000) {
        redirectToUrlFor(LEVELS_DATA[LEVEL_DATA_ID].nextUrlSlug);
    }
}

function draw() {
    img.loadPixels();

    if (!noise_sound.isPlaying() && noise_sound.isLoaded()) {
        noise_sound.loop();
    }

    // update particles positions
    // shake
    if (!EXPLODED) {

        for (let w = 0; w < NUM_PARTICLES; w++) {
            // top left goes top left, top right goes top right etc
            particle_coords[w] = [
                particle_coords[w][0] + 0.1 * random(-5, 5),
                particle_coords[w][1] + 0.1 * random(-5, 5),
                particle_coords[w][2], //untouched
                particle_coords[w][3] //untouched
            ];
        }
        maxBri = 0.0001 * (1 + random(7));
        fx.setUniform('maxBri', maxBri);

        fx.setUniform('color', LEVELS_DATA[LEVEL_DATA_ID].colorFunc()._array);
    } else {

        // explode
        for (let w = 0; w < NUM_PARTICLES; w++) {
            // top left goes top left, top right goes top right etc
            let dx = particle_coords[w][0] > width / 3 ? 1 : -1;
            let dy = particle_coords[w][1] > height / 3 ? 1 : -1;
            particle_coords[w] = [
                particle_coords[w][0] + dx * random(5),
                particle_coords[w][1] + dy * random(5),
                particle_coords[w][2], //untouched
                particle_coords[w][3] //untouched
            ];

            if (particle_coords[w][1] < 0) {
                particle_coords[w][1] = height;
            }
        }
        let explode_elapsed = min(millis() - EXPLODE_START_T, 1000);
        maxBri = 0.0008 * lerp(1, 0, explode_elapsed / 1000);
        fx.setUniform('maxBri', maxBri);

        fx.setUniform('color', lerpColor(color(255, 0, 255), color(0, 255, 255), explode_elapsed / 1000)._array);

        // Auto redirect to home after 10 seconds of explosion
        if (millis() - EXPLODE_START_T > 1000 * soundtrack.duration()) {
            redirectToUrlFor(LEVELS_DATA[LEVEL_DATA_ID].nextUrlSlug);
        }
    }

    // prepare 1D pixels map to be read by shader, and to store particle spatial coordinates data
    for (let x = 0; x < img.width; x++) {
        img.pixels[x * 4 + 0] = particle_coords[x % NUM_PARTICLES][0]; // Particle X
        img.pixels[x * 4 + 1] = particle_coords[x % NUM_PARTICLES][1]; // Particle Y
        //img.pixels[x*4+2] = floor(random(256)); // Particle radius
        img.pixels[x * 4 + 3] = 255; // unused
    }
    img.updatePixels();
    fx.setUniform('tex', img);


    quad(-1, -1, 1, -1, 1, 1, -1, 1);
}
