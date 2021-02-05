// Inspired from https://discourse.processing.org/t/fragment-shader-too-many-uniforms-error/17603/13
// POC'ed at https://editor.p5js.org/myselfhimself/sketches/mwEIYrOWO

let LEVEL_ID = location.hash;
if(LEVEL_ID == undefined || LEVEL_ID.indexOf('#level') != 0 || LEVEL_ID.length != '#level1'.length) {
  console.log('Level is unset, defaulting to 1');
  LEVEL_ID = 1;
} else {
  LEVEL_ID = parseInt(LEVEL_ID.substr('#level'.length, 1));
}
LEVEL_TEXT = {1:["LEVEL1", "CAEN"], 2:["LEVEL2", "LEHAVRE"], 3:["LEVEL3", "MONDE"]};
console.log(LEVEL_TEXT[LEVEL_ID]);

let img;
let fx;
let NUM_PARTICLES;
let particle_coords = [];
let maxBri;

let points;
let bonds;

let EXPLODED = false;
let EXPLODE_START_T = 0;

let soundtrack, explosion_sound, noise_sound;

let REDIRECTING = false;
let NEXT_URL = 'index.html';

function preload() {

  font = loadFont('assets/inconsolata.otf');
  soundtrack = loadSound('assets/SilentiumMonoShort.mp3');
  explosion_sound = loadSound('assets/cold-explosion-fx.wav');
  noise_sound = loadSound('assets/vinyl-noises_121bpm_G_major.wav');

}

function setup() {
  BWB_WIDTH = BWB_HEIGHT = 300;
  setupCanvas();
  soundtrack.play();

  points = font.textToPoints(LEVEL_TEXT[LEVEL_ID][0], width / (LEVEL_TEXT[LEVEL_ID][1].length*5), height / 2, 70, {
    sampleFactor: 0.1,
    simplifyThreshold: 0
  });
  points = points.concat(font.textToPoints(LEVEL_TEXT[LEVEL_ID][1], width / (LEVEL_TEXT[LEVEL_ID][1].length*5), height / 2 + 70, 70, {
    sampleFactor: 0.1,
    simplifyThreshold: 0
  }));

  NUM_PARTICLES = points.length;

  for (let i = 0; i < NUM_PARTICLES; i++) {
    // x,y,yspeed,random intial offset for use in x and/or ylocate
    particle_coords.push([points[i].x, height - points[i].y, 3, random(height)]);
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
    uniform float width;
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
  if (!EXPLODED) {
    EXPLODED = true;
    EXPLODE_START_T = millis();
    explosion_sound.play();
  } else if (millis() - EXPLODE_START_T > 1000 && !REDIRECTING) {
     if(window.location.href != NEXT_URL) {
       window.location.replace(NEXT_URL);
       REDIRECTING = true;
     }
  }
}

function draw() {
  img.loadPixels();

  if (!soundtrack.isPlaying() && !noise_sound.isPlaying()) {
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

    fx.setUniform('color', color(255, 255, 255)._array);
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
  fx.setUniform('width', width);


  quad(-1, -1, 1, -1, 1, 1, -1, 1);
}
