// Forked from https://molleindustria.github.io/p5.play/examples/index.html?fileName=breakout.js
//
//breakout close (core mechanics)
//mouse to control the paddle, click to start
BWB_DEBUG = false;

var LEVELS_DATA = [
    // Level 1
    {
        bricks: {
            count: 10,
            width: 20,
            height: 20,
            preload: null,
            setup: function () {

                var offsetX = width / 2 - (COLUMNS - 1) * (BRICK_MARGIN + BRICK_W) / 2;
                var offsetY = 80;

                for (var r = 0; r < ROWS; r++)
                    for (var c = 0; c < COLUMNS; c++) {
                        var brick = createSprite(offsetX + c * (BRICK_W + BRICK_MARGIN), offsetY + r * (BRICK_H + BRICK_MARGIN), BRICK_W, BRICK_H);
                        brick.draw = function () {
                            ellipse(0, 0, BRICK_W, BRICK_H);
                        };
                        brick.setCollider('circle');
                        brick.debug = BWB_DEBUG;
                        brick.shapeColor = color(255, 255, 255);
                        bricks.add(brick);
                        brick.immovable = true;
                    }
            },
            draw: null,
        },
        nextUrlSlug: "intro1",
    },
    // Level 2
    {
        bricks: {
            count: 10,
            width: 20,
            height: 20,
            preload: null,
            setup: function () {

                var offsetX = width / 2 - (COLUMNS - 1) * (BRICK_MARGIN + BRICK_W) / 2;
                var offsetY = 80;

                for (var r = 0; r < ROWS; r++)
                    for (var c = 0; c < COLUMNS; c++) {
                        var brick = createSprite(offsetX + c * (BRICK_W + BRICK_MARGIN), offsetY + r * (BRICK_H + BRICK_MARGIN), BRICK_W, BRICK_H);
                        brick.draw = function () {
                            rect(0, 0, BRICK_W, BRICK_H);
                        };
                        brick.setCollider('rectangle');
                        brick.debug = BWB_DEBUG;
                        brick.shapeColor = color(255, 255, 255);
                        bricks.add(brick);
                        brick.immovable = true;
                    }
            },
            draw: null,
        },
        nextUrlSlug: "intro2",
    },
    // Level 3
    {
        bricks: {
            count: 10,
            width: 20,
            height: 20,
            collider: 'circle',
            preload: function () {
                cog1 = loadImage('cog1.png');
            },
            setup: function() {
                var offsetX = width / 2 - (COLUMNS - 1) * (cog1_interspacing_width_ratio*cog1.width) / 2;
                var offsetY = 80;
                    for (let h = 0; h < ROWS; h++) {
                        for (let w = 0; w < COLUMNS; w++) {
                            cog = createSprite(offsetX + w * cog1.width * cog1_interspacing_width_ratio, offsetY + h * cog1.height * cog1_interspacing_width_ratio, 0, 0);
                            let cogRotDirection = (w % 2 == 0 ? -1 : 1) * (h % 2 == 0 ? -1 : 1);
                            cog.rotation += 10;
                            cog.rotationSpeed = 3 * cogRotDirection;
                            cog.debug = BWB_DEBUG;
                            cog.addImage(cog1);
                            cog.setCollider('circle');
                            cog.immovable = true;

                            bricks.add(cog);
                        }
                    }
                },
            draw: null,
        },
        nextUrlSlug: "win",
    }
];

var paddle, ball, wallTop, wallBottom, wallLeft, wallRight;
var bricks;
var BALL_DIAMETER = 30;
var BALL_START_POSITION_X = function () { return width / 2;};
var BALL_START_POSITION_Y = function () { return height - 200;};
var MAX_SPEED = 9;
var BALL_SPEED = 0;
var WALL_THICKNESS = 0;
var BRICK_W = 80;
var BRICK_H = 80;
var BRICK_MARGIN = BRICK_W/20;
var ROWS = 2;
var COLUMNS = 5;

var cog1; // cog image
var cog1_interspacing_width_ratio = 0.8;

function preload() {
    if(LEVELS_DATA[BWB_LEVEL_ID].bricks.preload != null) {
        LEVELS_DATA[BWB_LEVEL_ID].bricks.preload();
    }
}

function setup() {
    setupCanvas(false);

    paddle = createSprite(width / 2, height-11, 110, 20);
    paddle.setCollider('rectangle');
    paddle.debug = BWB_DEBUG;
    paddle.immovable = true;

    wallTop = createSprite(width / 2, -WALL_THICKNESS / 2, width + WALL_THICKNESS * 2, WALL_THICKNESS);
    wallTop.immovable = true;
    wallTop.debug = BWB_DEBUG;

    wallBottom = createSprite(width / 2, height + WALL_THICKNESS / 2, width + WALL_THICKNESS * 2, WALL_THICKNESS);
    wallBottom.immovable = true;
    wallBottom.debug = BWB_DEBUG;

    wallLeft = createSprite(-WALL_THICKNESS / 2, height / 2, WALL_THICKNESS, height);
    wallLeft.immovable = true;
    wallLeft.debug = BWB_DEBUG;

    wallRight = createSprite(width + WALL_THICKNESS / 2, height / 2, WALL_THICKNESS, height);
    wallRight.immovable = true;
    wallRight.debug = BWB_DEBUG;

    bricks = new Group();

    if(LEVELS_DATA[BWB_LEVEL_ID].bricks.setup != null) {
        LEVELS_DATA[BWB_LEVEL_ID].bricks.setup();
    }

    //the easiest way to avoid pesky multiple collision is to
    //have the ball bigger than the bricks
    ball = createSprite(BALL_START_POSITION_X(), BALL_START_POSITION_Y(), BALL_DIAMETER, BALL_DIAMETER);
    ball.draw = function () {
        ellipse(0, 0, BALL_DIAMETER, BALL_DIAMETER);
    };
    ball.setCollider('circle');
    ball.debug = BWB_DEBUG;
    ball.maxSpeed = MAX_SPEED;
    paddle.shapeColor = ball.shapeColor = color(255, 255, 255);

}

function mouseClicked() {
    // debugging
    print([mouseX, mouseY]);
}

function draw() {
    background(247, 134, 131);

    if(LEVELS_DATA[BWB_LEVEL_ID].bricks.draw != null) {
        LEVELS_DATA[BWB_LEVEL_ID].bricks.draw();
    }

    drawSprites();


    if (BWB_GAME_STATE == BWB_GAME_STATE_PAUSED) {
        textSize(32);
        text('PAUSE', 10, 30);
        fill(0, 102, 153);
        text('PAUSE', 10, 60);
        fill(0, 102, 153, 51);
        text('PAUSE', 10, 90);
    } else {
        gameLogic();
    }
}

function gameLogic() {
    paddle.position.x = constrain(mouseX, paddle.width / 2, width - paddle.width / 2);


    ball.bounce(wallTop);
    ball.bounce(wallLeft);
    ball.bounce(wallRight);

    if (ball.bounce(paddle)) {
        var swing = (ball.position.x - paddle.position.x) / 3;
        console.log(ball.getDirection());
        // Flip direction (ie. angle) if positive
        // positive direction values may occur at the very beginning if the paddle center and ball center get very close
        // in such a situation, the ball would pass through the paddle downwards after a horizontal slide..
        let newDirection = ball.getDirection();
        if(newDirection > 0) {
            newDirection *= -1.0;
            print("flipped");
        }
        ball.setSpeed(MAX_SPEED, newDirection + swing);
        BALL_SPEED = ball.getSpeed();
        console.log(ball.getDirection() + swing);
    }

    ball.bounce(bricks, brickHit);

    if (bricks.length == 0) {
        BWB_GAME_STATE = BWB_GAME_STATE_WIN;
    }

    if (ball.collide(wallBottom)) {
        BWB_GAME_STATE = BWB_GAME_STATE_LOSE;
    }

    // Prevent ball from going away forever through walls
    if (ball.position.x < 0 || ball.position.x > width || ball.position.y < 0 || ball.position.y > height) {
        ball.position.x = BALL_START_POSITION_X();
        ball.position.y = BALL_START_POSITION_Y();
    }

    // Do not allow exactly horizontal ball flight
    if(ball.getDirection() == 0) {
        ball.setSpeed(BALL_SPEED, ball.getDirection()+1);
    }

    switch (BWB_GAME_STATE) {
        case BWB_GAME_STATE_WIN:
            redirectToUrlFor(LEVELS_DATA[BWB_LEVEL_ID].nextUrlSlug);
            break;
        case BWB_GAME_STATE_LOSE:
            redirectToGameOver();
            break;
    }
}

function keyReleased() {
    if(keyCode == 68) { // D to toggle debugging
        BWB_DEBUG = !BWB_DEBUG;
        ball.debug = paddle.debug = BWB_DEBUG;
        for(let b = 0; b < bricks.length; b++) {
            bricks[b].debug = BWB_DEBUG;
        }
    }

    // Win / Lose debugging shortcuts
    if(BWB_DEBUG && BWB_GAME_STATE == BWB_GAME_STATE_PLAYING) {
        if (keyCode == 87) { // W
            BWB_GAME_STATE = BWB_GAME_STATE_WIN;
        } else if (keyCode == 76) { // L
            BWB_GAME_STATE = BWB_GAME_STATE_LOSE;
        }
    }

    if(BWB_GAME_STATE == BWB_GAME_STATE_PLAYING || BWB_GAME_STATE == BWB_GAME_STATE_PAUSED) {
        if (keyCode == 27) { // Escape
            if (BWB_GAME_STATE == BWB_GAME_STATE_PAUSED) {
                ball.setSpeed(BALL_SPEED);
                BWB_GAME_STATE = BWB_GAME_STATE_PLAYING;
            } else {
                pause();
            }
        }
    }
}

function pause() {
    BWB_GAME_STATE = BWB_GAME_STATE_PAUSED;
    BALL_SPEED = ball.getSpeed();
    ball.setSpeed(0);
}
function unpause() {
    BWB_GAME_STATE = BWB_GAME_STATE_PLAYING;
    ball.setSpeed(BALL_SPEED);
}

function mousePressed() {
    if (BWB_GAME_STATE == BWB_GAME_STATE_PLAYING && ball.velocity.x == 0 && ball.velocity.y == 0) {
        ball.setSpeed(MAX_SPEED, random(90 - 10, 90 + 10));
    } else if(BWB_GAME_STATE == BWB_GAME_STATE_PAUSED) {
        unpause();
    }
}

function brickHit(ball, brick) {
    brick.remove();
}