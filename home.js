// sound
let soundtrack;

// models
let game_start;
let game_title;

// logo orientation
let lastXAngle = 0;
let lastZAngle = 0;

// state & animation progress management
let HOME_STATE_POSTER = 0;
let HOME_STATE_MENU = 1;
let HOME_STATE = HOME_STATE_POSTER;
let menuFrameCount = 0;

function preload() {
    soundtrack = loadSound('assets/SpiegelImSpiegelMonoShort.mp3');
    game_title = loadModel('sprites/gameplay/3d/game_title.obj', true);
    game_start = loadModel('sprites/gameplay/3d/game_start.obj', true);
}

function setup() {
    setupCanvas();
    soundtrack.loop();
}

function draw() {
    background(0);
    noStroke();

    // background blinking random color squares moving in circle
    let circleId = 0;
    for (let origX = -width / 2; origX < width/2; origX += 200) {
        for (let origY = -height / 2; origY < height/2; origY += 200) {
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

    if(HOME_STATE == HOME_STATE_POSTER) {
        cursor(HAND);
    } else {
        menuFrameCount++;
            cursor(ARROW);

        if(min(menuFrameCount/100,1.0) >= 1.0) {
            // Start button ellipse
            let origX = 0;
            let origY = 120;
            let orbit_radius_x = 150;
            let orbit_radius_y = 50;
            for (let a = 0; a < 20; a++) {
                push();
                translate(origX + orbit_radius_x * sin(frameCount * 0.01 + a * 10), origY + orbit_radius_y * cos(frameCount * 0.01 + a * 10), 0);
                if (mouseOverStart()) {
                    specularMaterial(random(0, 1));
                    lights();
                } else {
                    fill(random(255), random(255), random(255));
                }
                rotateX(10);
                plane(10 + random(5));
                pop();
            }

            // Start button text
            push();
            rotateX(80);
            rotateX(0.2 * sin(frameCount * 0.01));
            translate(0, 50, 120);
            normalMaterial();
            if (mouseOverStart()) {
                cursor(HAND);
                specularMaterial(0.1);
                lights();
                scale(1.2 + 0.1 * sin(frameCount * 0.7));
            } else {
                cursor(ARROW);
            }
            model(game_start);
            pop();
        }

        push();
            // Make logo go away backwards by scaling down and moving slightly upwards
            scale(lerp(1.0, 0.6, min(menuFrameCount/100, 1.0)));
            translate(0, lerp(0, -100, min(menuFrameCount/100, 1.0)), 0);
    } // END OF HOME_STATE == HOME_STATE_MENU
        push();
            rotateX(-90);
            // POSTER MODE HAS MOUSE-BASED LOGO ROTATION
            if(HOME_STATE == HOME_STATE_POSTER) {
                lastXAngle += (height / 2 - mouseY) / abs(height / 2 - mouseY) * 0.01;
                lastZAngle -= (width / 2 - mouseX) / abs(width / 2 - mouseX) * 0.01;
                rotateX(lastXAngle);
                rotateZ(lastZAngle);
            // MENU MODE LOGO ROTATION IS MOUSE-INDEPENDENT
            } else { // if HOME_STATE_MENU
                rotateX(0.2*sin(frameCount*0.01));
                rotateZ(0.2*sin(frameCount*0.01));
            }
            normalMaterial();
            scale(3 * windowHeight / 980); // sort of responsive scaling
            translate(0, 0, 0);
            model(game_title);

            // orbiting logo sphere
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
                lights();
                pop();
                camera(0, 0, (height/2.0) / tan(PI*30.0 / 180.0), 0, 0, 0, 0, 1, 0);
            pop();
    if(HOME_STATE == HOME_STATE_MENU) {
        pop();
    }
}

function mouseOverStart() {
    return mouseX > 290 && mouseX < 600 && mouseY > 265 && mouseY < 435;
}

function mouseReleased() {
    userStartAudio(); // Chrome hack
    if(HOME_STATE == HOME_STATE_POSTER) {
        if(mouseX < width && mouseX > 0 && mouseY < height && mouseY > 0) {
            HOME_STATE = HOME_STATE_MENU;
        }
    } else if(mouseOverStart()) {
        redirectToUrlFor('howto');
    }
}
