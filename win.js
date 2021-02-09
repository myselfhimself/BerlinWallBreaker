let game_title;
let button;
let lastMouseX;
let lastMouseY;
let lastMouseFrameCount;
let lastXAngle = 0;
let lastZAngle = 0;
let cnv;

function preload() {
    soundtrack = loadSound('assets/SpiegelImSpiegelMonoShort.mp3');
    game_title = loadModel('sprites/gameplay/3d/game_title.obj', true);
}

function setup() {
    setupCanvas();
    soundtrack.loop();
    lastMouseX = mouseX;
    lastMouseY = mouseY;
}

function draw() {
    background(0);
    noStroke();

    let circleId = 0;
    for (let origX = -width / 2; origX < width; origX += 200) {
        for (let origY = -height / 2; origY < height; origY += 200) {
            circleId++;
            let orbit_radius = 60 + (circleId % 4) * 15;
            for (let a = 0; a < 20; a++) {
                push();
                translate(origX + orbit_radius * sin(frameCount * 0.01 + a * 10), origY + orbit_radius * cos(frameCount * 0.01 + a * 10), 0);

                fill(random(255), random(255), random(255));
                plane(3 + random(5));
                pop();
            }
        }
    }

    push();
    rotateX(-90);
    lastXAngle += (height / 2 - mouseY) / abs(height / 2 - mouseY) * 0.01;
    lastZAngle -= (width / 2 - mouseX) / abs(width / 2 - mouseX) * 0.01;
    rotateX(lastXAngle);
    rotateZ(lastZAngle);
    normalMaterial();
    scale(3 * windowHeight / 980); // sort of responsive scaling
    translate(0, 0, -30);
    model(game_title);

    push();
    origX = -30;
    origY = 0;
    orbit_radius = 100;
    a = 0;
    orbitSpeed = 0.1;
    translate(origX + orbit_radius * sin(frameCount * orbitSpeed + a * 10), origY + orbit_radius * cos(frameCount * orbitSpeed + a * 10), 0);

    sphere(14, 10, 10);
    pop();

    push();
    translate(0, 0, 100);
    scale(2);
    pointLight(0, 0, 250, origX + 20 + orbit_radius * sin(frameCount * orbitSpeed + a * 10), origY + orbit_radius * cos(frameCount * orbitSpeed + a * 10), 100);
    pointLight(0, 250, 0, origX + 20 + orbit_radius * sin(frameCount * orbitSpeed + a * 10 + 90), origY + orbit_radius * cos(frameCount * orbitSpeed + a * 10 + 90), 100);
    pointLight(250, 0, 0, origX + 20 + orbit_radius * sin(frameCount * orbitSpeed + a * 10 + 180), origY + orbit_radius * cos(frameCount * orbitSpeed + a * 10 + 180), 100);
    specularMaterial(250);
    lights();
    pop();
}
